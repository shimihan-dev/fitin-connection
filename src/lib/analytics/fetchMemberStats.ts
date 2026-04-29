import { supabase } from '../../../utils/supabase/client'

type WorkoutLogRow = {
  created_at: string
  muscle_group: string | null
  type: string | null
  duration: number | null
  volume: number | null
  calories: number | null
}

export type WorkoutSummary = {
  totalVolume: number
  totalCalories: number
  totalSessions: number
  avgVolumePerSession: number
  topMuscle: string
  adherenceRate: number       // 0~1 (실제 세션 / 목표 세션)
  muscleBreakdown: { muscle: string; volume: number; share: number }[]
  weeklyTrend: { week: string; volume: number; sessions: number }[]
}

export type GoalProgress = {
  label: string               // "주 3회 출석", "주간 볼륨 30,000kg"
  current: number
  target: number
  pct: number                 // 0~100
  status: 'done' | 'on_track' | 'behind'
}

export async function fetchMemberStats(
  userId: string,
  period: 'week' | 'month' | 'all'
): Promise<{ summary: WorkoutSummary; goals: GoalProgress[] }> {
  const fromDate = period === 'week'
    ? new Date(Date.now() - 7  * 86400000).toISOString()
    : period === 'month'
    ? new Date(Date.now() - 30 * 86400000).toISOString()
    : '2000-01-01'

  const { data, error } = await supabase
    .from('workout_logs')
    .select('created_at, muscle_group, type, duration, volume, calories')
    .eq('user_id', userId)
    .gte('created_at', fromDate)
    .order('created_at', { ascending: true })

  if (error) throw error
  const logs = (data ?? []) as WorkoutLogRow[]

  // ── 집계 ──
  const totalVolume   = logs.reduce((s, r) => s + (r.volume   ?? 0), 0)
  const totalCalories = logs.reduce((s, r) => s + (r.calories ?? 0), 0)
  const totalSessions = logs.length

  // 근육군별 볼륨
  const muscleMap: Record<string, number> = {}
  logs.forEach(r => {
    if (r.muscle_group) {
      muscleMap[r.muscle_group] = (muscleMap[r.muscle_group] ?? 0) + (r.volume ?? 0)
    }
  })
  const muscleBreakdown = Object.entries(muscleMap)
    .map(([muscle, volume]) => ({ muscle, volume, share: totalVolume > 0 ? volume / totalVolume : 0 }))
    .sort((a, b) => b.volume - a.volume)
  const topMuscle = muscleBreakdown[0]?.muscle ?? '-'

  // 주간 트렌드 (날짜를 주 단위로 묶기)
  const weekMap: Record<string, { volume: number; sessions: number }> = {}
  logs.forEach(r => {
    const d = new Date(r.created_at)
    const weekKey = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`
    if (!weekMap[weekKey]) weekMap[weekKey] = { volume: 0, sessions: 0 }
    weekMap[weekKey].volume   += r.volume ?? 0
    weekMap[weekKey].sessions += 1
  })
  const weeklyTrend = Object.entries(weekMap).map(([week, v]) => ({ week, ...v }))

  // 목표 달성률 (기본 목표: 주 3회, 주간 볼륨 30,000kg)
  const weekCount = period === 'week' ? 1 : period === 'month' ? 4 : weeklyTrend.length || 1
  const targetSessions = 3 * weekCount
  const targetVolume   = 30000 * weekCount

  const goals: GoalProgress[] = [
    {
      label: `주 ${Math.round(targetSessions / weekCount)}회 출석`,
      current: totalSessions,
      target: targetSessions,
      pct: Math.min(100, Math.round((totalSessions / targetSessions) * 100)),
      status: totalSessions >= targetSessions ? 'done'
            : totalSessions >= targetSessions * 0.7 ? 'on_track' : 'behind',
    },
    {
      label: '주간 볼륨 목표',
      current: Math.round(totalVolume / weekCount),
      target: 30000,
      pct: Math.min(100, Math.round(((totalVolume / weekCount) / 30000) * 100)),
      status: (totalVolume / weekCount) >= 30000 ? 'done'
            : (totalVolume / weekCount) >= 21000 ? 'on_track' : 'behind',
    },
  ]

  const summary: WorkoutSummary = {
    totalVolume, totalCalories, totalSessions,
    avgVolumePerSession: totalSessions > 0 ? Math.round(totalVolume / totalSessions) : 0,
    topMuscle,
    adherenceRate: Math.min(1, totalSessions / targetSessions),
    muscleBreakdown,
    weeklyTrend,
  }

  return { summary, goals }
}
