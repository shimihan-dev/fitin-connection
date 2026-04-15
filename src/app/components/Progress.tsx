import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Plus,
  Trash2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardRail } from './DashboardRail';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

interface ProgressProps {
  user: { name: string; email: string } | null;
  onNavigate: (page: Page) => void;
}

interface WorkoutLog {
  id: string;
  date: string;
  minutes: number;
  type: string;
}

const mondayBasedIndex = (date: Date) => (date.getDay() + 6) % 7;

const getSeed = (value: string) =>
  value.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);

export function Progress({ user, onNavigate }: ProgressProps) {
  const { language } = useLanguage();
  const isKorean = language === 'ko';

  const content = isKorean
    ? {
        heroKicker: 'Performance Analysis',
        heroTitle: '활동 흐름이 가장 좋아요.',
        heroBody: '주간 목표를 이미 넘어섰어요. 지금은 회복 세션과 수분 밸런스를 함께 챙기면 다음 이틀이 더 안정적입니다.',
        secondaryCta: '대시보드',
        primaryCta: '기록 추가',
        summaryStats: ['일 평균', '활동 일수', '수분 섭취'],
        chartTitle: 'Weekly Intensity',
        chartBody: '활동 시간과 회복 리듬을 함께 보는 이번 주 흐름',
        live: 'LIVE',
        week: '주간',
        month: '월간',
        stepsLabel: '오늘 걸음 수',
        stepsProgress: 'Daily Progress',
        caloriesLabel: '소모 칼로리',
        heartLabel: '심혈관 상태',
        heartBody: '현재 휴식 심박은 안정적인 상위권 범위에 있어요.',
        nutritionLabel: 'Nutrition',
        viewTrends: '흐름 보기',
        chartInsight: '가장 강한 흐름',
        hydrationNote: '운동량 대비 수분 밸런스가 안정적으로 유지되고 있어요.',
        recentTitle: 'Recent Sessions',
        recentLink: '전체 기록 보기',
        empty: '아직 기록된 운동이 없어요. 첫 세션을 추가해 보세요.',
        dialogTitle: '운동 기록 추가',
        dialogBody: '오늘의 세션을 빠르게 남기고 활동 흐름에 반영해 보세요.',
        workoutType: '운동 종류',
        workoutTypePlaceholder: '예: Morning Run',
        duration: '운동 시간',
        save: '저장하기',
        delete: '삭제',
        fromLastWeek: '지난주 대비',
        todayGain: '오늘',
      }
    : {
        heroKicker: 'Performance Analysis',
        heroTitle: 'Your activity is peaking.',
        heroBody: 'You have already pushed past your weekly target. Prioritize recovery blocks and hydration over the next 48 hours.',
        secondaryCta: 'Dashboard',
        primaryCta: 'Add Log',
        summaryStats: ['Avg day', 'Active days', 'Hydration'],
        chartTitle: 'Weekly Intensity',
        chartBody: 'A live view of your active minutes against recovery rhythm',
        live: 'LIVE',
        week: 'Week',
        month: 'Month',
        stepsLabel: 'Total Steps Today',
        stepsProgress: 'Daily Progress',
        caloriesLabel: 'Calories Burned',
        heartLabel: 'Cardiovascular Health',
        heartBody: 'Your resting heart rate is sitting in a strong, stable range for this week.',
        nutritionLabel: 'Nutrition',
        viewTrends: 'View trends',
        chartInsight: 'Peak rhythm',
        hydrationNote: 'Hydration is staying in a healthy range for your current load.',
        recentTitle: 'Recent Sessions',
        recentLink: 'See all activity',
        empty: 'No workouts logged yet. Add your first session to start the timeline.',
        dialogTitle: 'Add Workout',
        dialogBody: 'Log today’s session quickly and feed it into your live activity overview.',
        workoutType: 'Workout Type',
        workoutTypePlaceholder: 'e.g. Morning Run',
        duration: 'Duration',
        save: 'Save Workout',
        delete: 'Delete',
        fromLastWeek: 'from last week',
        todayGain: 'today',
      };

  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    try {
      const saved = localStorage.getItem(`workouts_${user?.email}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newWorkoutType, setNewWorkoutType] = useState('');
  const [newWorkoutMinutes, setNewWorkoutMinutes] = useState(30);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`workouts_${user.email}`, JSON.stringify(workoutLogs));
    }
  }, [workoutLogs, user?.email]);

  const seed = getSeed(user?.email || user?.name || 'fitin');
  const sortedLogs = useMemo(
    () => [...workoutLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [workoutLogs],
  );

  const totalMinutes = workoutLogs.reduce((acc, log) => acc + log.minutes, 0);
  const totalWorkouts = workoutLogs.length;
  const activeDays = new Set(workoutLogs.map((log) => new Date(log.date).toDateString())).size || 1;
  const averageMinutes = Math.round(totalMinutes / activeDays) || 0;
  const dailyCalories = 1880 + averageMinutes * 8 + (seed % 140);
  const restingHeartRate = Math.max(56, 67 - Math.min(9, Math.round(totalWorkouts / 3)) + (seed % 4));
  const hydrationLiters = Number((1.5 + Math.min(totalMinutes / 720, 0.65) + ((seed % 5) * 0.08)).toFixed(1));
  const stepsToday = Math.round(9800 + (seed % 3200) + totalMinutes * 1.9);
  const stepsProgress = Math.min(96, Math.round((stepsToday / 15000) * 100));
  const activityDelta = Math.max(8, Math.min(24, Math.round((averageMinutes / 120) * 100) || 14));

  const handleAddWorkout = () => {
    if (!newWorkoutType.trim()) {
      alert(isKorean ? '운동 종류를 입력해주세요.' : 'Please enter a workout type.');
      return;
    }

    const newLog: WorkoutLog = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      minutes: newWorkoutMinutes,
      type: newWorkoutType.trim(),
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);
    setShowAddDialog(false);
    setNewWorkoutType('');
    setNewWorkoutMinutes(30);
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm(isKorean ? '이 운동 기록을 삭제하시겠습니까?' : 'Delete this workout log?')) {
      setWorkoutLogs((prev) => prev.filter((log) => log.id !== id));
    }
  };

  const weekdayLabels = isKorean ? ['월', '화', '수', '목', '금', '토', '일'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const todayIndex = mondayBasedIndex(now);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyData = weekdayLabels.map((label, index) => {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + index);

    const minutes = workoutLogs
      .filter((log) => new Date(log.date).toDateString() === currentDate.toDateString())
      .reduce((acc, log) => acc + log.minutes, 0);

    return {
      label,
      value: minutes || 18 + ((seed + index * 19) % 64),
      active: index === todayIndex,
    };
  });

  const monthlyData = ['W1', 'W2', 'W3', 'W4'].map((label, index) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - index * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const minutes = workoutLogs
      .filter((log) => {
        const date = new Date(log.date);
        return date >= weekStart && date <= weekEnd;
      })
      .reduce((acc, log) => acc + log.minutes, 0);

    return {
      label,
      value: minutes || 135 + ((seed + index * 31) % 90),
      active: index === 0,
    };
  }).reverse();

  const chartData = timeRange === 'week' ? weeklyData : monthlyData;
  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);
  const recentWorkouts = sortedLogs.slice(0, 5);
  const peakChartItem = chartData.reduce((best, item) => (item.value > best.value ? item : best), chartData[0]);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const nutritionItems = [
    { label: 'Protein', value: `${132 + (seed % 26)}g`, tone: 'text-primary' },
    { label: 'Carbs', value: `${204 + (seed % 30)}g`, tone: 'text-sky-600' },
    { label: 'Fats', value: `${52 + (seed % 15)}g`, tone: 'text-orange-600' },
  ];

  const minuteOptions = [15, 20, 30, 40, 45, 60, 75, 90];

  return (
    <div className="py-3 sm:py-5">
      <div className="grid gap-8 lg:grid-cols-[248px_minmax(0,1fr)]">
        <DashboardRail user={user} activeSection="activity" onNavigate={onNavigate} />

        <div className="space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <header className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
              <div>
                <p className="apple-kicker">{content.heroKicker}</p>
                <h1 className="mt-4 max-w-full text-[clamp(2.35rem,5vw,4.7rem)] font-black leading-[0.94] tracking-[-0.08em] text-foreground lg:whitespace-nowrap">
                  {content.heroTitle}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {content.heroBody}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="apple-micro-card">
                    <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {content.summaryStats[0]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                      {Math.max(averageMinutes, 24)} min
                    </p>
                  </div>
                  <div className="apple-micro-card">
                    <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {content.summaryStats[1]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                      {activeDays}
                    </p>
                  </div>
                  <div className="apple-micro-card">
                    <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {content.summaryStats[2]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                      {hydrationLiters}L
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 xl:justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="apple-ghost-button px-5"
                >
                  {content.secondaryCta}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDialog(true)}
                  className="apple-button gap-2 px-6"
                >
                  <Plus className="h-4 w-4" />
                  {content.primaryCta}
                </button>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-12">
              <div className="apple-panel xl:col-span-8 p-6 sm:p-8">
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/6 blur-3xl" />
                <div className="relative flex flex-col">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="whitespace-nowrap text-[2rem] font-black tracking-[-0.06em] text-foreground">
                        {content.chartTitle}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">{content.chartBody}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="apple-chip">{content.live}</span>
                      <div className="apple-segmented">
                        {(['week', 'month'] as const).map((range) => (
                          <button
                            key={range}
                            type="button"
                            onClick={() => setTimeRange(range)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                              timeRange === range
                                ? 'bg-white text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {range === 'week' ? content.week : content.month}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex h-[320px] items-end gap-3 rounded-[28px] bg-[linear-gradient(180deg,rgba(241,244,250,0.92),rgba(247,248,251,0.76))] px-4 pb-4 pt-8 sm:px-6">
                    {chartData.map((item) => (
                      <div key={item.label} className="flex h-full flex-1 flex-col items-center gap-4">
                        <div className="flex h-full w-full items-end justify-center rounded-[24px] bg-white/60 px-1.5 pb-2">
                          <div
                            className={`w-full rounded-[20px] ${
                              item.active
                                ? 'bg-[linear-gradient(180deg,#1b6cff,#0f58e8)] shadow-[0_14px_28px_rgba(20,99,255,0.24)]'
                                : 'bg-[linear-gradient(180deg,#d7ddec,#eef2f8)]'
                            }`}
                            style={{ height: `${Math.max(16, Math.round((item.value / maxChartValue) * 100))}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold tracking-[0.14em] ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="apple-divider mt-7" />
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                    <span>
                      {content.chartInsight}: <span className="font-semibold text-foreground">{peakChartItem.label}</span> · {peakChartItem.value} min
                    </span>
                    <span className="font-semibold text-primary">+{activityDelta}% {content.fromLastWeek}</span>
                  </div>
                </div>
              </div>

              <div className="apple-panel xl:col-span-4 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primary">
                    <Footprints className="h-5 w-5" />
                  </span>
                  <span className="whitespace-nowrap text-sm font-bold text-orange-600">
                    +{Math.max(1.1, (stepsToday - 10000) / 1000).toFixed(1)}k {content.todayGain}
                  </span>
                </div>
                <h3 className="mt-10 text-5xl font-black tracking-[-0.08em] text-foreground">
                  {stepsToday.toLocaleString()}
                </h3>
                <p className="mt-2 whitespace-nowrap text-base text-muted-foreground">{content.stepsLabel}</p>
                <p className="mt-4 text-sm font-semibold text-primary">+{activityDelta}% {content.fromLastWeek}</p>
                <div className="mt-14 rounded-[24px] bg-slate-100/90 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">{content.stepsProgress}</span>
                    <span className="text-primary">{stepsProgress}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${stepsProgress}%` }} />
                  </div>
                </div>
              </div>

              <div className="apple-panel xl:col-span-4 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                    <Flame className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {isKorean ? '목표: 2,400' : 'Target: 2,400'}
                  </span>
                </div>
                <h3 className="mt-10 text-5xl font-black tracking-[-0.08em] text-foreground">
                  {dailyCalories.toLocaleString()}
                </h3>
                <p className="mt-2 text-base text-muted-foreground">{content.caloriesLabel}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {isKorean ? '목표까지 약 460kcal 남았어요.' : 'Roughly 460 kcal left to hit today’s target.'}
                </p>
                <div className="mt-8 flex gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className={`h-1.5 flex-1 rounded-full ${index < 2 ? 'bg-orange-500' : 'bg-orange-200'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(160deg,#22242b,#1d1f25_58%,#30333c)] p-6 text-white shadow-[0_28px_80px_rgba(17,24,39,0.18)] xl:col-span-5 sm:p-7">
                <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/12" />
                <div className="relative">
                  <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                    {content.heartLabel}
                  </p>
                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-6xl font-black tracking-[-0.08em]">{restingHeartRate}</span>
                    <span className="pb-2 text-2xl text-white/78">BPM</span>
                  </div>
                  <p className="mt-5 max-w-[28ch] text-sm leading-6 text-white/70">
                    {content.heartBody}
                  </p>
                  <div className="mt-8 flex items-end gap-2">
                    {[18, 34, 44, 22, 50, 16, 40].map((height, index) => (
                      <span
                        key={index}
                        className="w-1.5 rounded-full bg-white/72"
                        style={{ height }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('progress')}
                    className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90"
                  >
                    {content.viewTrends}
                  </button>
                </div>
              </div>

              <div className="apple-panel xl:col-span-3 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <h3 className="whitespace-nowrap text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                    {content.nutritionLabel}
                  </h3>
                  <button
                    type="button"
                    onClick={() => onNavigate('diet')}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_18px_32px_rgba(20,99,255,0.24)]"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  {nutritionItems.map((item) => (
                    <div key={item.label} className="rounded-full bg-slate-50 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-foreground">{item.label}</span>
                        <span className={item.tone}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[22px] bg-sky-50/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                        {isKorean ? 'Hydration' : 'Hydration'}
                      </p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">{hydrationLiters}L</p>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary">
                      <Droplets className="h-[18px] w-[18px]" />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{content.hydrationNote}</p>
                </div>
              </div>
            </div>
          </motion.section>

          <section className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="whitespace-nowrap text-[2rem] font-black tracking-[-0.06em] text-foreground">
                {content.recentTitle}
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('workout')}
                className="text-sm font-semibold text-primary"
              >
                {content.recentLink}
              </button>
            </div>

            {recentWorkouts.length === 0 ? (
              <div className="apple-panel p-8 text-center">
                <p className="text-base text-muted-foreground">{content.empty}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentWorkouts.map((workout, index) => {
                  const calories = Math.round(workout.minutes * 8.1 + 124);
                  const distance = (workout.minutes / 12).toFixed(1);
                  const iconSet = [Activity, Flame, HeartPulse];
                  const toneSet = ['bg-teal-50 text-teal-700', 'bg-blue-50 text-primary', 'bg-slate-100 text-slate-700'];
                  const Icon = iconSet[index % iconSet.length];
                  const toneClass = toneSet[index % toneSet.length];
                  const workoutDate = new Date(workout.date);
                  const workoutStart = new Date(workoutDate);
                  workoutStart.setHours(0, 0, 0, 0);
                  const daysDiff = Math.floor((todayStart.getTime() - workoutStart.getTime()) / 86400000);
                  const badgeLabel =
                    daysDiff === 0 ? (isKorean ? '오늘' : 'Today') : daysDiff === 1 ? (isKorean ? '어제' : 'Yesterday') : null;

                  return (
                    <div
                      key={workout.id}
                      className="apple-panel flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex h-16 w-16 items-center justify-center rounded-[20px] ${toneClass}`}>
                          <Icon className="h-6 w-6" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-[1.45rem] font-black tracking-[-0.05em] text-foreground">
                              {workout.type}
                            </p>
                            {badgeLabel ? (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                                {badgeLabel}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {new Intl.DateTimeFormat(isKorean ? 'ko-KR' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            }).format(new Date(workout.date))}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 sm:min-w-[360px]">
                        <MetricCell label={isKorean ? '거리' : 'Distance'} value={`${distance} km`} />
                        <MetricCell label={isKorean ? '칼로리' : 'Calories'} value={`${calories} kcal`} />
                        <MetricCell label={isKorean ? '시간' : 'Duration'} value={`${workout.minutes}:00`} />
                      </div>

                      <div className="flex items-center gap-3 sm:pl-2">
                        <button
                          type="button"
                          onClick={() => onNavigate('workout')}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-foreground"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {content.delete}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[30px] border-white/80 bg-white/90 p-0 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:max-w-lg">
          <div className="p-6 sm:p-7">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-[2rem] font-black tracking-[-0.06em] text-foreground">
                {content.dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                {content.dialogBody}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {content.workoutType}
                </Label>
                <Input
                  value={newWorkoutType}
                  onChange={(e) => setNewWorkoutType(e.target.value)}
                  placeholder={content.workoutTypePlaceholder}
                  className="apple-input"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {content.duration}
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {minuteOptions.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => setNewWorkoutMinutes(minutes)}
                      className={`rounded-[18px] px-3 py-3 text-sm font-semibold transition-all ${
                        newWorkoutMinutes === minutes
                          ? 'bg-primary text-white shadow-[0_14px_28px_rgba(20,99,255,0.24)]'
                          : 'bg-slate-100 text-foreground'
                      }`}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddWorkout}
                className="apple-button w-full justify-center"
              >
                {content.save}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-slate-50 px-4 py-3 text-center">
      <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 whitespace-nowrap text-base font-bold tracking-[-0.04em] text-foreground">{value}</p>
    </div>
  );
}
