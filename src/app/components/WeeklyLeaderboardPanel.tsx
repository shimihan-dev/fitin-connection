import { useMemo, useState } from 'react';
import { Activity, Flame, Medal, Target, Trophy } from 'lucide-react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import {
  WeeklyMemberProfile,
  getNextWeeklyTier,
  getWeeklyTierMeta,
} from '../data/weeklyMemberProfiles';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
import { Progress } from './ui/progress';

interface WeeklyLeaderboardPanelProps {
  isKorean: boolean;
  profiles: WeeklyMemberProfile[];
}

const numberFormatter = new Intl.NumberFormat('en-US');

function getCompletionRate(profile: WeeklyMemberProfile) {
  if (profile.goalMetrics.length === 0) return 0;

  const total = profile.goalMetrics.reduce((sum, goal) => {
    if (goal.target <= 0) return sum;
    return sum + Math.min(goal.actual / goal.target, 1);
  }, 0);

  return Math.round((total / profile.goalMetrics.length) * 100);
}

function formatKiloTick(value: number) {
  if (value === 0) return '0';
  return `${Math.round(value / 1000)}k`;
}

export function WeeklyLeaderboardPanel({
  isKorean,
  profiles,
}: WeeklyLeaderboardPanelProps) {
  const sortedProfiles = useMemo(
    () => [...profiles].sort((a, b) => b.score - a.score),
    [profiles],
  );
  const [selectedProfileId, setSelectedProfileId] = useState(
    sortedProfiles[0]?.id ?? '',
  );

  const selectedProfile =
    sortedProfiles.find((profile) => profile.id === selectedProfileId) ??
    sortedProfiles[0];

  if (!selectedProfile) {
    return null;
  }

  const completionRate = getCompletionRate(selectedProfile);
  const tierMeta = getWeeklyTierMeta(selectedProfile.score, isKorean);
  const nextTier = getNextWeeklyTier(selectedProfile.score, isKorean);
  const columns = isKorean
    ? ['순위', '이름', '포커스', '포인트', '티어', '보상']
    : ['Rank', 'Name', 'Focus', 'Points', 'Tier', 'Reward'];
  const chartConfig = {
    volumeKg: {
      label: isKorean ? '볼륨 (kg)' : 'Volume (kg)',
      color: '#1d4ed8',
    },
    durationMinutes: {
      label: isKorean ? '운동 시간 (min)' : 'Duration (min)',
      color: '#f59e0b',
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-5">
          <div className="apple-soft-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="apple-kicker">
                  {isKorean ? '선택된 회원' : 'Selected Member'}
                </p>
                <h3 className="mt-3 text-[1.85rem] font-black tracking-[-0.06em] text-foreground">
                  {selectedProfile.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedProfile.university} · {selectedProfile.focus}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <span className="apple-chip">
                  <Medal className="h-3.5 w-3.5" />
                  {completionRate}%
                </span>
                <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {selectedProfile.sourceType === 'actual'
                    ? isKorean
                      ? '실측 로그'
                      : 'Actual Log'
                    : isKorean
                      ? '루틴 추정'
                      : 'Routine Derived'}
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-foreground/80">
              {selectedProfile.primaryGoal}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isKorean ? '운동일' : 'Training Days'}
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">
                  {selectedProfile.trainingDays}/{selectedProfile.targetDays}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isKorean ? '운동 시간' : 'Weekly Minutes'}
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">
                  {numberFormatter.format(selectedProfile.weeklyMinutes)} min
                </p>
              </div>
              <div className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {selectedProfile.volumeEstimated
                    ? isKorean
                      ? '예상 볼륨'
                      : 'Estimated Volume'
                    : isKorean
                      ? '누적 볼륨'
                      : 'Total Volume'}
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">
                  {numberFormatter.format(selectedProfile.volumeKg)} kg
                </p>
              </div>
              <div className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isKorean ? '연속 기록' : 'Streak'}
                </p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">
                  {selectedProfile.streakDays}d
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    {isKorean ? '현재 보상 티어' : 'Current Reward Tier'}
                  </p>
                  <p className="mt-2 text-2xl font-black tracking-[-0.05em]">
                    {tierMeta.label}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${tierMeta.chipClass}`}>
                  {selectedProfile.score} pt
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/78">
                {tierMeta.reward}
              </p>
              <div className="mt-4 rounded-[18px] border border-white/14 bg-white/10 px-4 py-3 text-sm leading-6 text-white/74">
                {nextTier
                  ? isKorean
                    ? `${nextTier.label}까지 ${nextTier.remaining}pt 남았습니다.`
                    : `${nextTier.remaining} points left to reach ${nextTier.label}.`
                  : isKorean
                    ? '최상위 티어를 유지 중입니다. 지금의 흐름을 계속 밀어보세요.'
                    : 'Already in the top tier. Keep this pace going.'}
              </div>
            </div>
          </div>

          <div className="apple-soft-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="apple-kicker">
                  {isKorean ? '목표 달성률' : 'Goal Completion'}
                </p>
                <h4 className="mt-2 text-[1.45rem] font-black tracking-[-0.05em] text-foreground">
                  {isKorean ? '주간 목표 진행도' : 'Weekly Goal Progress'}
                </h4>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary">
                <Target className="h-4.5 w-4.5" />
              </span>
            </div>

            <div className="mt-5 rounded-[22px] border border-blue-100 bg-blue-50/70 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {isKorean ? '전체 달성률' : 'Overall Completion'}
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-3xl font-black tracking-[-0.06em] text-foreground">
                  {completionRate}%
                </p>
                <p className="max-w-[24ch] text-right text-sm leading-6 text-muted-foreground">
                  {selectedProfile.sourceType === 'actual'
                    ? isKorean
                      ? '워크북의 실제 주간 로그를 기준으로 계산했습니다.'
                      : 'Calculated from the workbook’s weekly session log.'
                    : isKorean
                      ? '문서에 적힌 루틴 빈도와 세트를 기반으로 추정했습니다.'
                      : 'Derived from the documented routine frequency and sets.'}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {selectedProfile.goalMetrics.map((goal) => {
                const rate =
                  goal.target > 0
                    ? Math.round(Math.min(goal.actual / goal.target, 1) * 100)
                    : 0;

                return (
                  <div key={goal.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {goal.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {numberFormatter.format(goal.actual)}
                        {goal.unit}
                        {' / '}
                        {numberFormatter.format(goal.target)}
                        {goal.unit}
                      </p>
                    </div>
                    <Progress value={rate} className="h-2.5 bg-slate-200" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="apple-kicker">
                {isKorean ? 'Weekly Report' : 'Weekly Report'}
              </p>
              <h3 className="mt-2 text-[1.7rem] font-black tracking-[-0.05em] text-foreground">
                {isKorean ? '주간 순위표' : 'Weekly Leaderboard'}
              </h3>
            </div>
            <span className="apple-chip">
              <Trophy className="h-3.5 w-3.5" />
              {sortedProfiles.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-[26px] border border-white/80 bg-white/72">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50/90">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProfiles.map((profile, index) => {
                  const profileTier = getWeeklyTierMeta(profile.score, isKorean);
                  const isSelected = profile.id === selectedProfile.id;

                  return (
                    <tr
                      key={profile.id}
                      className={`${isSelected ? 'bg-blue-50/70' : 'bg-white/75'} border-t border-slate-100 transition-colors`}
                    >
                      <td className="px-4 py-4 text-sm font-bold text-foreground">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedProfileId(profile.id)}
                          className="flex items-center gap-3 text-left"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-foreground">
                            {profile.name.charAt(0)}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-foreground transition-colors hover:text-primary">
                              {profile.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {profile.university}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                        {profile.focus}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-foreground">
                        {profile.score} pt
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${profileTier.chipClass}`}>
                          {profileTier.label}
                        </span>
                      </td>
                      <td className="min-w-[220px] px-4 py-4 text-sm text-muted-foreground">
                        {profileTier.reward}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)]">
        <div className="apple-soft-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="apple-kicker">
                {isKorean ? '일별 운동 추이' : 'Daily Trend'}
              </p>
              <h4 className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                {isKorean
                  ? `${selectedProfile.name} 회원 운동 추이`
                  : `${selectedProfile.name}'s workout trend`}
              </h4>
            </div>
            <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              {selectedProfile.sourceLabel}
            </span>
          </div>

          <ChartContainer
            className="mt-6 aspect-auto h-[310px] w-full"
            config={chartConfig}
          >
            <ComposedChart
              accessibilityLayer
              data={selectedProfile.dailyTrend}
              margin={{ top: 12, right: 8, left: 4, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="shortLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                width={46}
                tickFormatter={formatKiloTick}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={34}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      const focus = payload?.[0]?.payload?.focus;
                      return focus ? `${value} · ${focus}` : `${value}`;
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                yAxisId="left"
                dataKey="volumeKg"
                fill="var(--color-volumeKg)"
                radius={[10, 10, 0, 0]}
                maxBarSize={34}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="durationMinutes"
                stroke="var(--color-durationMinutes)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-durationMinutes)', r: 4 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ChartContainer>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {isKorean ? '요약' : 'Summary'}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {selectedProfile.sourceType === 'actual'
                  ? isKorean
                    ? '실제 워크북의 세션별 시간과 볼륨을 그대로 시각화했습니다.'
                    : 'This chart visualizes the workbook’s real session time and volume.'
                  : isKorean
                    ? '문서에 적힌 세트/중량/빈도로 일별 시간을 환산해 시각화했습니다.'
                    : 'The daily trend is derived from the documented sets, loads, and frequency.'}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Flame className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {isKorean ? '핵심 메모' : 'Key Note'}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {selectedProfile.routineSummary[0]}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="apple-soft-card p-5 sm:p-6">
            <div>
              <p className="apple-kicker">
                {isKorean ? '운동 요약' : 'Workout Summary'}
              </p>
              <h4 className="mt-2 text-[1.45rem] font-black tracking-[-0.05em] text-foreground">
                {isKorean ? '핵심 하이라이트' : 'Key Highlights'}
              </h4>
            </div>

            <div className="mt-5 space-y-3">
              {selectedProfile.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="rounded-[22px] border border-white/80 bg-white/88 px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {highlight.label}
                  </p>
                  <p className="mt-2 text-lg font-black tracking-[-0.04em] text-foreground">
                    {highlight.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {highlight.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="apple-soft-card p-5 sm:p-6">
            <div>
              <p className="apple-kicker">
                {isKorean ? '원본 반영 포인트' : 'Source Notes'}
              </p>
              <h4 className="mt-2 text-[1.45rem] font-black tracking-[-0.05em] text-foreground">
                {isKorean ? '자료 기반 코멘트' : 'Source-based Notes'}
              </h4>
            </div>

            <div className="mt-5 space-y-3">
              {selectedProfile.routineSummary.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-white/78 bg-white/86 px-4 py-4 text-sm leading-6 text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
