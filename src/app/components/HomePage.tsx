import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  MessageSquare,
  Sparkles,
  Target,
  Trophy,
  Utensils,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { getGlobalSetting } from '../../../utils/globalSettings';

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
        progressLabel: 'Daily Progress',
        sessionTitle: '오늘 아침 세션을 시작할 준비가 되었나요?',
        sessionBody: '가볍게 몸을 풀고, 가장 잘 맞는 루틴으로 하루를 열어보세요.',
        checkIn: '체크인',
        steps: '걸음 수',
        stepsGoal: '목표',
        hydration: '수분 섭취',
        hydrationBody: '좋아요. 점심 전 한 잔만 더 마시면 충분해요.',
        trends: '활동 트렌드',
        viewDetails: '상세 보기',
        quickStart: '빠른 시작',
        programTag: 'NEW PROGRAM',
        programTitle: 'Mindful Movement\n21일 코어 & 밸런스',
        programMeta: '20분',
        programLevel: 'Intermediate',
        focus: '오늘 집중할 것',
        focusBody: '스트레칭과 중심 안정화에 집중해 보세요.',
        greeting: (name: string, hour: number) => {
          if (hour < 12) return `${name}님, 좋은 아침이에요.`;
          if (hour < 18) return `${name}님, 좋은 오후예요.`;
          return `${name}님, 편안한 저녁이에요.`;
        },
      }
    : {
        progressLabel: 'Daily Progress',
        sessionTitle: 'Ready for your morning session?',
        sessionBody: 'Ease into the day with a lighter routine and a focused training plan.',
        checkIn: 'Check-in',
        steps: 'Steps',
        stepsGoal: 'Goal',
        hydration: 'Hydration',
        hydrationBody: 'You are doing great. One more glass before lunch should do it.',
        trends: 'Activity Trends',
        viewDetails: 'View details',
        quickStart: 'Quick Start',
        programTag: 'NEW PROGRAM',
        programTitle: 'Mindful Movement\n21 Days of Core & Calm',
        programMeta: '20 min',
        programLevel: 'Intermediate',
        focus: 'Focus for Today',
        focusBody: 'Center the session around mobility and controlled core work.',
        greeting: (name: string, hour: number) => {
          if (hour < 12) return `Good Morning, ${name}.`;
          if (hour < 18) return `Good Afternoon, ${name}.`;
          return `Good Evening, ${name}.`;
        },
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

  const weekdayLabels = isKorean ? ['월', '화', '수', '목', '금', '토', '일'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weeklyMinutes = weekdayLabels.map((label, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);

    const loggedMinutes = storedWorkouts
      .filter((workout) => new Date(workout.date).toDateString() === day.toDateString())
      .reduce((total, workout) => total + workout.minutes, 0);

    const fallbackMinutes = 18 + ((seed + index * 17) % 60);
    const minutes = loggedMinutes || fallbackMinutes;

    return {
      label,
      minutes,
      isToday: index === todayIndex,
    };
  });

  const totalMinutes = storedWorkouts.reduce((acc, workout) => acc + workout.minutes, 0);
  const sessionsThisWeek = storedWorkouts.filter((workout) => new Date(workout.date) >= startOfWeek).length;
  const steps = Math.round(6200 + (seed % 2500) + totalMinutes * 2.4);
  const hydrationLiters = Number((1.35 + ((seed % 7) * 0.11) + Math.min(totalMinutes / 600, 0.8)).toFixed(1));
  const hydrationGoal = 2.2;
  const stepsGoal = 10000;
  const completion = Math.min(96, Math.max(28, Math.round((sessionsThisWeek / 4) * 100)));

  const quickActions: { id: Page; label: string; icon: typeof Dumbbell; tint: string; bg: string }[] = [
    { id: 'workout', label: isKorean ? '운동/루틴' : 'Workout/Routine', icon: Dumbbell, tint: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'progress', label: isKorean ? '기록' : 'Progress', icon: Activity, tint: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'diet', label: isKorean ? '식단' : 'Diet', icon: Utensils, tint: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'competition', label: isKorean ? '대회' : 'Compete', icon: Trophy, tint: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'board', label: isKorean ? '게시판' : 'Board', icon: MessageSquare, tint: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const dateLabel = new Intl.DateTimeFormat(isKorean ? 'ko-KR' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="px-1">
          <p className="apple-kicker">Fitin Daily</p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.6rem,8vw,5.2rem)] font-black leading-[0.92] tracking-[-0.08em] text-foreground">
            {content.greeting(user?.name || 'Fitin', now.getHours())}
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">{dateLabel}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
          <div className="apple-panel p-6 sm:p-7">
            <div className="absolute -left-8 top-20 h-20 w-20 rotate-45 rounded-3xl bg-slate-100/90" />
            <div className="absolute bottom-[-22px] right-[-18px] h-32 w-32 rotate-[38deg] rounded-[32px] bg-slate-100/95" />
            <div className="relative">
              <p className="apple-kicker">{content.progressLabel}</p>
              <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <h2 className="max-w-[12ch] text-4xl font-black leading-[1.02] tracking-[-0.06em] text-foreground sm:text-5xl">
                    {content.sessionTitle}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    {content.sessionBody}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('workout')}
                  className="apple-button shrink-0 gap-2 px-7"
                >
                  <Dumbbell className="h-4 w-4" />
                  {content.checkIn}
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="apple-soft-card px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary">
                      <Footprints className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{content.steps}</p>
                      <p className="text-lg font-bold tracking-[-0.04em]">{steps.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="apple-soft-card px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-primary">
                      <Droplets className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{content.hydration}</p>
                      <p className="text-lg font-bold tracking-[-0.04em]">{hydrationLiters}L</p>
                    </div>
                  </div>
                </div>

                <div className="apple-soft-card px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {isKorean ? '달성률' : 'Completion'}
                      </p>
                      <p className="text-lg font-bold tracking-[-0.04em]">{completion}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="apple-panel p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primary">
                  <Footprints className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-8 text-sm text-foreground/70">{content.steps}</p>
              <p className="mt-1 text-5xl font-black tracking-[-0.08em] text-foreground">{steps.toLocaleString()}</p>
              <div className="mt-6 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#0f63ff,#1f78ff)]"
                  style={{ width: `${Math.min(100, Math.round((steps / stepsGoal) * 100))}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {content.stepsGoal}: {stepsGoal.toLocaleString()}
              </p>
            </div>

            <div className="apple-panel overflow-hidden p-6">
              <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_38%)]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-primary shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                    <Droplets className="h-5 w-5" />
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {Math.min(100, Math.round((hydrationLiters / hydrationGoal) * 100))}%
                  </span>
                </div>
                <p className="mt-12 text-sm text-foreground/70">{content.hydration}</p>
                <p className="mt-1 text-5xl font-black tracking-[-0.08em] text-foreground">{hydrationLiters}L</p>
                <p className="mt-5 max-w-[24ch] text-sm leading-6 text-muted-foreground">{content.hydrationBody}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="apple-panel p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="apple-kicker">{content.quickStart}</p>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-foreground">
                  {isKorean ? '오늘의 메뉴' : 'Today at a Glance'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="text-sm font-semibold text-primary"
              >
                {content.viewDetails}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="apple-soft-card flex items-center gap-3 px-4 py-4 text-left transition-transform hover:-translate-y-0.5"
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.tint}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="apple-panel p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-[1.65rem] font-black leading-none tracking-[-0.06em] text-foreground">
                {content.trends}
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                {content.viewDetails}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 flex h-[180px] items-end gap-3">
              {weeklyMinutes.map((item) => {
                const height = Math.max(18, Math.min(100, item.minutes));
                return (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                    <div className="flex h-full w-full items-end justify-center rounded-full bg-slate-100/90 px-2 pb-2">
                      <div
                        className={`w-full rounded-full ${
                          item.isToday
                            ? 'bg-[linear-gradient(180deg,#1c73ff,#0f58e8)] shadow-[0_10px_24px_rgba(20,99,255,0.24)]'
                            : 'bg-[linear-gradient(180deg,#c6d7f6,#dfe7f8)]'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${item.isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SBD Competition Status Section */}
          {(sbdStatusText || sbdStatusImage) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="apple-panel p-6 sm:p-7 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-32 w-32 bg-violet-100 rounded-bl-[100px] -z-10 blur-2xl opacity-50" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-black tracking-tight text-foreground">
                    SBD 대회 현황
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('competition')}
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  자세히 보기 &rarr;
                </button>
              </div>

              {sbdStatusImage && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm">
                  <img src={sbdStatusImage} alt="SBD Competition Leaderboard" className="w-full h-auto object-cover" />
                </div>
              )}
              {sbdStatusText && (
                <div className="mt-4 p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                  <p className="text-sm md:text-base font-medium text-violet-900 break-words">
                    {sbdStatusText}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(145deg,#1a6d70,#102a2a)] p-6 text-white shadow-[0_30px_60px_rgba(16,42,42,0.24)]">
            <div className="absolute right-[-42px] top-[-46px] h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-28px] left-[-24px] h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

            <div className="relative">
              <span className="apple-chip border-white/15 bg-white/12 text-white">{content.programTag}</span>
              <h3 className="mt-6 max-w-[12ch] whitespace-pre-line text-4xl font-black leading-[0.95] tracking-[-0.07em] text-white">
                {content.programTitle}
              </h3>
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/80">
                <span className="inline-flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {content.programMeta}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  {content.programLevel}
                </span>
              </div>
              <div className="mt-8 rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-xl">
                <p className="apple-kicker text-white/80">{content.focus}</p>
                <p className="mt-3 text-sm leading-6 text-white/80">{content.focusBody}</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
