import { useState, useEffect } from 'react'
import { fetchMemberStats, WorkoutSummary, GoalProgress } from '../lib/analytics/fetchMemberStats'
import { useAuth } from '../app/contexts/AuthContext'

export type PeriodFilter = 'week' | 'month' | 'all'

export function useMemberStats(period: PeriodFilter) {
  const { user } = useAuth()
  const [summary, setSummary] = useState<WorkoutSummary | null>(null)
  const [goals, setGoals]     = useState<GoalProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<Error | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetchMemberStats(user.id, period)
      .then(({ summary, goals }) => {
        setSummary(summary)
        setGoals(goals)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [user?.id, period])

  return { summary, goals, loading, error }
}
