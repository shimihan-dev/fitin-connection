type WeeklyVolumePoint = {
  week: string
  volume: number
  sessions: number
}

type WeeklyVolumeChartProps = {
  data: WeeklyVolumePoint[]
}

export function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
  return (
    <section className="rounded-lg border p-4">
      <h3 className="mb-3 font-semibold">Weekly Volume</h3>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.week} className="flex items-center justify-between text-sm">
            <span>{item.week}</span>
            <span>{item.volume.toLocaleString()} kg / {item.sessions} sessions</span>
          </div>
        ))}
      </div>
    </section>
  )
}
