import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  MoonStar,
  Sparkles,
  Trophy,
  Users,
  Utensils,
} from 'lucide-react';
import { getGlobalSetting } from '../../../utils/globalSettings';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardRail } from './DashboardRail';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

interface HomePageProps {
  user: { name: string; email: string; profile_picture?: string } | null;
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

export function HomePage({ user, onNavigate }: HomePageProps) {
  const { language } = useLanguage();
  const isKorean = language === 'ko';

  const content = isKorean
    ? {
        heroKicker: '오늘의 대시보드',
        summary: '이번 주 움직임 목표의 82%까지 왔어요. 지금 흐름이 아주 좋습니다.',
        activityLabel: 'Daily Activity',
        activityTitle: 'Steps & Mobility',
        activityUnit: 'steps',
        heartRate: '휴식 심박',
        sleep: '수면 시간',
        sleepState: '안정적',
        featuredTag: "TODAY'S PICK",
        featuredTitle: 'Metabolic Ignite',
        featuredBody: '짧고 강한 인터벌과 코어 자극을 섞어서 아침 컨디션을 깨워주는 세션입니다.',
        featuredDuration: '45분',
        featuredLevel: 'High',
        featuredSupport: '모빌리티 워밍업과 인터벌 메인 블록이 자연스럽게 연결돼요.',
        exploreCompetition: '대회 둘러보기',
        openNutrition: '영양 보기',
        fuelStatus: 'Fuel Status',
        communityTitle: 'Fitin Circle',
        communityLink: '전체 활동 보기',
        recoveryTitle: 'Personalized Recovery',
        recoveryCards: [
          {
            title: '호흡 세션',
            body: '강도가 높았던 날의 긴장을 낮추는 10분 회복 루틴입니다.',
            icon: Sparkles,
            tint: 'text-primary',
            bg: 'bg-blue-50',
          },
          {
            title: '미네랄 회복',
            body: '근육 피로가 쌓인 날엔 수분과 전해질 밸런스를 먼저 챙겨보세요.',
            icon: Utensils,
            tint: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            title: 'Hydration Check',
            body: '점심 전 한 잔만 더 마시면 오늘 섭취 목표에 가까워집니다.',
            icon: Droplets,
            tint: 'text-orange-500',
            bg: 'bg-orange-50',
          },
        ],
        goalLabel: '목표',
        sessionsLabel: '이번 주 세션',
        weeklyTotalLabel: '이번 주 총량',
        peakLabel: '피크 요일',
        movementFocus: '오늘 집중 포인트',
        movementBody: '스트레칭과 중심 안정화에 집중해 보세요.',
        summaryStats: ['이번 주', '연속 기록', '평균 세션'],
        minutesUnit: '분',
        liveCircle: '실시간 활동',
        macroNote: '저녁 식사 전 단백질만 조금 더 보완하면 균형이 좋아져요.',
        rhythmNote: '가장 강했던 흐름',
        openRecovery: '회복 루틴 보기',
      }
    : {
        heroKicker: 'Dashboard',
        summary: "You're 82% toward your weekly movement goal. Keep the momentum gentle and steady.",
        activityLabel: 'Daily Activity',
        activityTitle: 'Steps & Mobility',
        activityUnit: 'steps',
        heartRate: 'Resting Heart Rate',
        sleep: 'Sleep Duration',
        sleepState: 'Optimal',
        featuredTag: "TODAY'S PICK",
        featuredTitle: 'Metabolic Ignite',
        featuredBody: 'A short, sharper conditioning block that wakes up the body with intervals and core work.',
        featuredDuration: '45 min',
        featuredLevel: 'High',
        featuredSupport: 'Mobility prep rolls directly into a sharper interval block for a cleaner morning start.',
        exploreCompetition: 'Explore Competition',
        openNutrition: 'Open Nutrition',
        fuelStatus: 'Fuel Status',
        communityTitle: 'Fitin Circle',
        communityLink: 'See all activity',
        recoveryTitle: 'Personalized Recovery',
        recoveryCards: [
          {
            title: 'Breathwork session',
            body: 'A 10-minute decompression block to lower tension after a higher-intensity day.',
            icon: Sparkles,
            tint: 'text-primary',
            bg: 'bg-blue-50',
          },
          {
            title: 'Mineral recovery',
            body: 'Refill fluids and electrolytes first when your legs feel heavier than usual.',
            icon: Utensils,
            tint: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            title: 'Hydration check',
            body: 'One more glass before lunch will bring you close to today’s target.',
            icon: Droplets,
            tint: 'text-orange-500',
            bg: 'bg-orange-50',
          },
        ],
        goalLabel: 'Goal',
        sessionsLabel: 'Sessions This Week',
        weeklyTotalLabel: 'Weekly Total',
        peakLabel: 'Peak Day',
        movementFocus: 'Focus for today',
        movementBody: 'Keep today centered on mobility and controlled core stability.',
        summaryStats: ['This week', 'Active streak', 'Avg session'],
        minutesUnit: 'min',
        liveCircle: 'Live circle',
        macroNote: 'A small protein top-up before dinner would put the day in a cleaner balance.',
        rhythmNote: 'Peak rhythm',
        openRecovery: 'Open recovery',
      };

  const storedWorkouts = useMemo<WorkoutLog[]>(() => {
    if (!user?.email || typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(`workouts_${user.email}`);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [user?.email]);

  const [sbdStatusText, setSbdStatusText] = useState<string | null>(null);
  const [sbdStatusImage, setSbdStatusImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSbdStatus() {
      const text = await getGlobalSetting('sbd_status_text');
      const img = await getGlobalSetting('sbd_status_image');
      if (text) setSbdStatusText(text);
      if (img) setSbdStatusImage(img);
    }

    fetchSbdStatus();
  }, []);

  const now = new Date();
  const seed = getSeed(user?.email || user?.name || 'fitin');
  const todayIndex = mondayBasedIndex(now);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const greeting = (() => {
    const name = user?.name || 'Fitin';
    if (isKorean) {
      if (now.getHours() < 12) return `${name}님, 좋은 아침이에요`;
      if (now.getHours() < 18) return `${name}님, 좋은 오후예요`;
      return `${name}님, 편안한 저녁이에요`;
    }

    if (now.getHours() < 12) return `Good Morning, ${name}`;
    if (now.getHours() < 18) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  })();

  const totalMinutes = storedWorkouts.reduce((acc, workout) => acc + workout.minutes, 0);
  const sessionsThisWeek = storedWorkouts.filter((workout) => new Date(workout.date) >= startOfWeek).length;
  const steps = Math.round(7600 + (seed % 2600) + totalMinutes * 2.2);
  const stepsGoal = 15000;
  const stepsProgress = Math.min(100, Math.round((steps / stepsGoal) * 100));
  const hydrationLiters = Number((1.45 + ((seed % 7) * 0.12) + Math.min(totalMinutes / 700, 0.65)).toFixed(1));
  const restingHeartRate = Math.max(58, 67 - Math.min(8, Math.round(totalMinutes / 180)) + (seed % 4));
  const sleepHours = 7 + ((seed + todayIndex) % 2);
  const sleepMinutes = 18 + ((seed + todayIndex * 7) % 35);

  const weekdayLabels = isKorean ? ['월', '화', '수', '목', '금', '토', '일'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyMinutes = weekdayLabels.map((label, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);

    const loggedMinutes = storedWorkouts
      .filter((workout) => new Date(workout.date).toDateString() === day.toDateString())
      .reduce((total, workout) => total + workout.minutes, 0);

    const fallbackMinutes = 24 + ((seed + index * 17) % 58);
    const minutes = loggedMinutes || fallbackMinutes;

    return {
      label,
      minutes,
      active: index === todayIndex,
    };
  });

  const maxMinutes = Math.max(...weeklyMinutes.map((item) => item.minutes), 1);
  const weeklyTotalMinutes = weeklyMinutes.reduce((total, item) => total + item.minutes, 0);
  const averageDailyMinutes = Math.round(weeklyTotalMinutes / weeklyMinutes.length);
  const peakDay = weeklyMinutes.reduce((best, item) => (item.minutes > best.minutes ? item : best), weeklyMinutes[0]);
  const protein = 124 + (seed % 32);
  const carbs = 188 + (seed % 46);
  const fats = 48 + (seed % 18);
  const workoutDates = new Set(storedWorkouts.map((item) => new Date(item.date).toDateString()));
  let streakDays = 0;

  if (storedWorkouts.length === 0) {
    streakDays = 3 + (seed % 4);
  } else {
    const cursor = new Date(now);
    cursor.setHours(0, 0, 0, 0);
    while (workoutDates.has(cursor.toDateString())) {
      streakDays += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const communityItems = isKorean
    ? [
        { name: 'Marcus Chen', body: '"Yoga Flow" 완료' },
        { name: 'Sarah Williams', body: '5K PR 달성' },
        { name: 'David Miller', body: '"Marathon Prep" 시작' },
      ]
    : [
        { name: 'Marcus Chen', body: 'Completed "Yoga Flow"' },
        { name: 'Sarah Williams', body: 'Just hit a 5K PR' },
        { name: 'David Miller', body: 'Joined "Marathon Prep"' },
      ];

  const dateLabel = new Intl.DateTimeFormat(isKorean ? 'ko-KR' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const metricCards = [
    {
      title: content.heartRate,
      value: `${restingHeartRate}`,
      suffix: 'BPM',
      note: '+4% avg',
      icon: HeartPulse,
      tone: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      title: content.sleep,
      value: `${sleepHours}h ${sleepMinutes}m`,
      suffix: '',
      note: content.sleepState,
      icon: MoonStar,
      tone: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <div className="py-3 sm:py-5">
      <div className="grid gap-8 lg:grid-cols-[248px_minmax(0,1fr)]">
        <DashboardRail user={user} activeSection="overview" onNavigate={onNavigate} />

        <div className="space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <header className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_auto] xl:items-end">
              <div>
                <p className="apple-kicker">{content.heroKicker}</p>
                <h1 className="mt-4 max-w-[12ch] text-[clamp(2.8rem,6vw,5rem)] font-black leading-[0.92] tracking-[-0.08em] text-foreground">
                  {greeting}
                  <span className="text-primary">.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {dateLabel}. {content.summary}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="apple-micro-card">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {content.summaryStats[0]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                      {weeklyTotalMinutes} {content.minutesUnit}
                    </p>
                  </div>
                  <div className="apple-micro-card">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {content.summaryStats[1]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                      {streakDays}d
                    </p>
                  </div>
                  <div className="apple-micro-card">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {content.summaryStats[2]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                      {Math.max(22, Math.round(weeklyTotalMinutes / Math.max(1, sessionsThisWeek || 4)))} {content.minutesUnit}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 xl:justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('competition')}
                  className="apple-ghost-button gap-2 px-5"
                >
                  <Trophy className="h-4 w-4 text-primary" />
                  {content.exploreCompetition}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('diet')}
                  className="apple-button gap-2 px-6"
                >
                  <Utensils className="h-4 w-4" />
                  {content.openNutrition}
                </button>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.92fr)]">
              <div className="space-y-6">
                <div className="apple-panel min-h-[420px] p-6 sm:p-8">
                  <div className="absolute -bottom-10 right-6 h-36 w-36 rounded-[44px] bg-slate-100/90" />
                  <div className="absolute bottom-10 right-28 h-28 w-28 rounded-[38px] bg-slate-100/85" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="apple-kicker">{content.activityLabel}</p>
                        <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-foreground sm:text-[2.35rem]">
                          {content.activityTitle}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="apple-chip">{stepsProgress}%</span>
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primary">
                          <ArrowUpRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-3">
                      <div className="apple-soft-card px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{content.sessionsLabel}</p>
                        <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">{Math.max(3, sessionsThisWeek || 4)}</p>
                      </div>
                      <div className="apple-soft-card px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{content.weeklyTotalLabel}</p>
                        <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">
                          {weeklyTotalMinutes} {content.minutesUnit}
                        </p>
                      </div>
                      <div className="apple-soft-card px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{content.peakLabel}</p>
                        <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-foreground">{peakDay.label}</p>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">{peakDay.minutes} {content.minutesUnit}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-12">
                      <p className="text-sm font-medium text-muted-foreground">
                        {content.movementFocus}: {content.movementBody}
                      </p>
                      <div className="flex flex-wrap items-end gap-2">
                        <span className="text-[clamp(3.4rem,8vw,5.4rem)] font-black leading-none tracking-[-0.1em] text-foreground">
                          {steps.toLocaleString()}
                        </span>
                        <span className="pb-2 text-lg font-semibold text-muted-foreground">
                          / {stepsGoal.toLocaleString()} {content.activityUnit}
                        </span>
                      </div>
                      <div className="mt-5 h-4 rounded-full bg-slate-200/90 p-1">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#0f63ff,#6ea0ff)] shadow-[0_12px_22px_rgba(20,99,255,0.22)]"
                          style={{ width: `${stepsProgress}%` }}
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{content.goalLabel}: {stepsGoal.toLocaleString()}</span>
                        <span>{content.rhythmNote}: {peakDay.label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="apple-panel p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                        {content.fuelStatus}
                      </h3>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-foreground">
                        <Utensils className="h-[18px] w-[18px]" />
                      </span>
                    </div>
                    <div className="mt-8 space-y-6">
                      <MacroRow label="Protein" current={protein} goal={180} barClass="bg-blue-500" />
                      <MacroRow label="Carbs" current={carbs} goal={250} barClass="bg-orange-500" />
                      <MacroRow label="Fats" current={fats} goal={70} barClass="bg-emerald-500" />
                    </div>
                    <div className="apple-divider mt-7" />
                    <p className="mt-5 text-sm leading-6 text-muted-foreground">{content.macroNote}</p>
                  </div>

                  <div className="apple-panel p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[1.55rem] font-black tracking-[-0.05em] text-foreground">
                          {content.communityTitle}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{content.liveCircle}</p>
                      </div>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-foreground">
                        <Users className="h-[18px] w-[18px]" />
                      </span>
                    </div>
                    <div className="mt-6 space-y-4">
                      {communityItems.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#dbe9ff,#c8dbff)] text-sm font-bold text-primary">
                            {item.name.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold tracking-[-0.03em] text-foreground">{item.name}</p>
                            <p className="truncate text-sm text-muted-foreground">{item.body}</p>
                          </div>
                          <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('board')}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      {content.communityLink}
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {metricCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <div key={card.title} className="apple-panel p-6 sm:p-7">
                        <div className="flex items-center justify-between">
                          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bg} ${card.tone}`}>
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className={`text-sm font-bold ${card.tone}`}>{card.note}</span>
                        </div>
                        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                          {card.title}
                        </p>
                        <div className="mt-2 flex items-end gap-1.5">
                          <span className="text-5xl font-black tracking-[-0.08em] text-foreground">{card.value}</span>
                          {card.suffix ? <span className="pb-2 text-lg text-foreground/70">{card.suffix}</span> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="apple-panel overflow-hidden">
                  <div className="grid md:grid-cols-[0.88fr_1.12fr]">
                    <div className="relative min-h-[280px] overflow-hidden bg-[linear-gradient(160deg,#183f4b,#2a666d_48%,#0f2025)] p-6 text-white">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_84%_24%,rgba(255,164,104,0.24),transparent_26%)]" />
                      <div className="absolute -bottom-8 right-8 h-36 w-24 rotate-[12deg] rounded-[30px] bg-white/12" />
                      <div className="absolute bottom-10 right-28 h-20 w-20 rounded-full bg-white/10" />
                      <div className="relative flex h-full flex-col">
                        <span className="inline-flex w-fit items-center rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78">
                          {content.featuredTag}
                        </span>
                        <div className="mt-auto">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10 backdrop-blur-sm">
                            <Dumbbell className="h-7 w-7 text-white" />
                          </div>
                          <p className="max-w-[14ch] text-4xl font-black leading-[0.94] tracking-[-0.08em]">
                            {content.featuredTitle}
                          </p>
                          <p className="mt-3 max-w-[18ch] text-sm leading-6 text-white/72">
                            {content.featuredSupport}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <p className="apple-kicker">{content.featuredTag}</p>
                      <h3 className="mt-3 text-[2rem] font-black leading-[1] tracking-[-0.06em] text-foreground">
                        {content.featuredTitle}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-muted-foreground">
                        {content.featuredBody}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="apple-chip">Mobility</span>
                        <span className="apple-chip">Intervals</span>
                        <span className="apple-chip">Core</span>
                      </div>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <div className="apple-soft-card px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {isKorean ? '예상 시간' : 'Duration'}
                          </p>
                          <p className="mt-2 text-xl font-bold tracking-[-0.04em] text-foreground">{content.featuredDuration}</p>
                        </div>
                        <div className="apple-soft-card px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {isKorean ? '강도' : 'Intensity'}
                          </p>
                          <p className="mt-2 text-xl font-bold tracking-[-0.04em] text-foreground">{content.featuredLevel}</p>
                        </div>
                      </div>
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onNavigate('workout')}
                          className="apple-button gap-2 px-6"
                        >
                          <Flame className="h-4 w-4" />
                          {isKorean ? '세션 시작' : 'Start Session'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('progress')}
                          className="apple-ghost-button gap-2"
                        >
                          <Footprints className="h-4 w-4 text-primary" />
                          {isKorean ? '활동 보기' : 'View Activity'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="apple-panel p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="apple-kicker">{content.activityLabel}</p>
                      <h3 className="mt-2 text-[1.75rem] font-black tracking-[-0.06em] text-foreground">
                        {isKorean ? '주간 흐름' : 'Weekly Rhythm'}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {content.rhythmNote}: {peakDay.label} · {averageDailyMinutes} {content.minutesUnit}/{isKorean ? '일' : 'day'}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">{stepsProgress}%</span>
                  </div>
                  <div className="mt-8 flex h-[180px] items-end gap-3">
                    {weeklyMinutes.map((item) => (
                      <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                        <div className="flex h-full w-full items-end rounded-[22px] bg-slate-100/80 p-2">
                          <div
                            className={`w-full rounded-[18px] ${
                              item.active
                                ? 'bg-[linear-gradient(180deg,#1a6bff,#0f58ea)] shadow-[0_14px_28px_rgba(20,99,255,0.22)]'
                                : 'bg-[linear-gradient(180deg,#d7deec,#eef2f8)]'
                            }`}
                            style={{ height: `${Math.max(18, Math.round((item.minutes / maxMinutes) * 100))}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {(sbdStatusText || sbdStatusImage) && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="apple-panel relative overflow-hidden p-6 sm:p-7"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-[100px] bg-violet-100 blur-2xl opacity-50" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <Trophy className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-foreground">
                      {isKorean ? 'SBD 대회 현황' : 'SBD Competition Status'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('competition')}
                    className="text-sm font-semibold text-violet-600 transition-colors hover:text-violet-700"
                  >
                    {isKorean ? '자세히 보기' : 'View details'}
                  </button>
                </div>

                {sbdStatusImage ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-border shadow-sm">
                    <img src={sbdStatusImage} alt="SBD Competition Leaderboard" className="h-auto w-full object-cover" />
                  </div>
                ) : null}

                {sbdStatusText ? (
                  <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                    <p className="break-words text-sm font-medium text-violet-900 md:text-base">
                      {sbdStatusText}
                    </p>
                  </div>
                ) : null}
              </div>
            </motion.section>
          )}

          <section className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[2rem] font-black tracking-[-0.06em] text-foreground">
                {content.recoveryTitle}
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('routine')}
                className="hidden text-sm font-semibold text-primary sm:inline-flex"
              >
                {isKorean ? '루틴 열기' : 'Open routine'}
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {content.recoveryCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div key={card.title} className="apple-panel p-6 sm:p-7">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${card.bg} ${card.tint}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-8 text-[1.65rem] font-black leading-[1.05] tracking-[-0.05em] text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{card.body}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate('routine')}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      {content.openRecovery}
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MacroRow({
  label,
  current,
  goal,
  barClass,
}: {
  label: string;
  current: number;
  goal: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-foreground">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {current}g / {goal}g
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div
          className={`h-2 rounded-full ${barClass}`}
          style={{ width: `${Math.min(100, Math.round((current / goal) * 100))}%` }}
        />
      </div>
    </div>
  );
}
