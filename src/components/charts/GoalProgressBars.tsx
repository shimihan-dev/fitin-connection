import type { GoalProgress } from '../../lib/analytics/fetchMemberStats'

type GoalProgressBarsProps = {
  goals: GoalProgress[]
}

export function GoalProgressBars({ goals }: GoalProgressBarsProps) {
  return (
    <section className="rounded-lg border p-4">
      <h3 className="mb-3 font-semibold">Goal Progress</h3>
      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{goal.label}</span>
              <span>{goal.pct}%</span>
            </div>
            <div className="h-2 rounded bg-muted">
              <div className="h-2 rounded bg-primary" style={{ width: `${goal.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
