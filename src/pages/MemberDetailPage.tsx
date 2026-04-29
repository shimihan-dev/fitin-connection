import { useState } from 'react'
import { useAuth } from '../app/contexts/AuthContext'
import { useMemberStats, PeriodFilter } from '../hooks/userMemberStats'
import type { WorkoutSummary } from '../lib/analytics/fetchMemberStats'
import { WeeklyVolumeChart } from '../components/charts/WeeklyVolumeChart'
import { GoalProgressBars } from '../components/charts/GoalProgressBars'
import { AIReportCard } from '../components/charts/AIReportCard'

export function MemberDetailPage() {
  const [period, setPeriod] = useState<PeriodFilter>('week')
  const { user } = useAuth()
  const { summary, goals, loading } = useMemberStats(period)

  if (loading) return <LoadingSkeleton />
  if (!summary || !user?.id) return null

  return (
    <div className="space-y-6 pb-12">

      {/* Devils "Batting Stats" → Fitin "Workout Summary" */}
      <KPICards summary={summary} />

      {/* Devils "Personal Goals" → Fitin "Goal Progress" */}
      <GoalProgressBars goals={goals} />

      {/* Devils "Season Growth Trends" → Fitin "Weekly Trends" */}
      <WeeklyVolumeChart data={summary.weeklyTrend} />

      {/* Devils "AI Analysis Report" → 완전히 동일한 구조 */}
      <AIReportCard userId={user.id} summary={summary} goals={goals} />

    </div>
  )
}

function LoadingSkeleton() {
  return <div className="h-32 animate-pulse rounded-lg bg-muted" />
}

function KPICards({ summary }: { summary: WorkoutSummary }) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">Sessions</p>
        <p className="text-2xl font-semibold">{summary.totalSessions}</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">Total Volume</p>
        <p className="text-2xl font-semibold">{summary.totalVolume.toLocaleString()} kg</p>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">Top Muscle</p>
        <p className="text-2xl font-semibold">{summary.topMuscle}</p>
      </div>
    </section>
  )
}
