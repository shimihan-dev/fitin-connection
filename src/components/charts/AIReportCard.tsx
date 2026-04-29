import type { GoalProgress, WorkoutSummary } from '../../lib/analytics/fetchMemberStats'

type AIReportCardProps = {
  userId: string
  summary: WorkoutSummary
  goals: GoalProgress[]
}

export function AIReportCard({ userId, summary, goals }: AIReportCardProps) {
  return (
    <section className="rounded-lg border p-4">
      <h3 className="mb-2 font-semibold">AI Analysis Report</h3>
      <p className="text-sm text-muted-foreground">
        User {userId}: {summary.totalSessions} sessions, {goals.length} goals tracked.
      </p>
    </section>
  )
}
