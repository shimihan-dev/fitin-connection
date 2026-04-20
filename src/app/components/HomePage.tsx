import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Award,
  ClipboardCheck,
  Dumbbell,
  Footprints,
  Medal,
  Star,
  Trophy,
} from 'lucide-react';
import { getGlobalSetting } from '../../../utils/globalSettings';
import { useLanguage } from '../contexts/LanguageContext';
import { INITIAL_RECORDS, UNIVERSITIES } from '../types/competition';
import { DashboardRail } from './DashboardRail';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';
type WorkoutTab = 'routine' | 'running' | 'diet';
type RoutineSubTab = 'planner' | 'upper' | 'lower';

interface NavigateOptions {
  workoutTab?: WorkoutTab;
  routineSubTab?: RoutineSubTab;
}

interface HomePageProps {
  user: { name: string; email: string; profile_picture?: string } | null;
  onNavigate: (page: Page, options?: NavigateOptions) => void;
}

interface WorkoutLog {
  id: string;
  date: string;
  minutes: number;
  type: string;
}

interface RunningRecord {
  id: string;
  date: string;
  imageUrl: string;
  distance: number;
  duration: string;
  pace: string;
}

interface WeeklyEntry {
  name: string;
  focus: string;
  score: number;
}

const mondayBasedIndex = (date: Date) => (date.getDay() + 6) % 7;

const getSeed = (value: string) =>
  value.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);

const runningPattern = /(run|running|러닝|조깅)/i;

const tierThresholds = [
  {
    key: 'bronze',
    min: 0,
    label: 'Bronze',
    rewardKo: '커뮤니티 배지 + 오픈짐 체크인 1회',
    rewardEn: 'Community badge + 1 open gym check-in',
    cardClass: 'border-[#d9b38c] bg-[#f6ebe0]',
    chipClass: 'bg-[#8f5d34] text-white',
    textClass: 'text-[#8f5d34]',
  },
  {
    key: 'silver',
    min: 260,
    label: 'Silver',
    rewardKo: '오픈짐 우선 예약 + 리뷰 배지',
    rewardEn: 'Priority open gym booking + review badge',
    cardClass: 'border-slate-300 bg-slate-100',
    chipClass: 'bg-slate-600 text-white',
    textClass: 'text-slate-600',
  },
  {
    key: 'gold',
    min: 420,
    label: 'Gold',
    rewardKo: 'PT 멘토링 우선 신청 + SBD 이벤트 초대',
    rewardEn: 'Priority PT mentoring + SBD event invite',
    cardClass: 'border-amber-300 bg-amber-50',
    chipClass: 'bg-amber-500 text-slate-950',
    textClass: 'text-amber-600',
  },
];

function parseStoredArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function getTierMeta(score: number, isKorean: boolean) {
  const tier =
    [...tierThresholds].reverse().find((item) => score >= item.min) ?? tierThresholds[0];

  return {
    ...tier,
    reward: isKorean ? tier.rewardKo : tier.rewardEn,
  };
}

function getNextTier(score: number, isKorean: boolean) {
  const nextTier = tierThresholds.find((item) => score < item.min);
  if (!nextTier) return null;

  return {
    ...nextTier,
    reward: isKorean ? nextTier.rewardKo : nextTier.rewardEn,
    remaining: nextTier.min - score,
  };
}

export function HomePage({ user, onNavigate }: HomePageProps) {
  const { language } = useLanguage();
  const isKorean = language === 'ko';

  const copy = isKorean
    ? {
        heroKicker: 'Fitin Dashboard',
        heroBody: '러닝, 헬스, IGC SBD 기록을 한 화면에서 관리하고 주간 리포트와 PT 멘토링까지 바로 연결해보세요.',
        heroLead: '운동 기록, 보상, 멘토링을 하나의 흐름으로 연결하는 Fitin Connection 메인 허브입니다.',
        summaryStats: ['주간 포인트', '연속 기록', '현재 티어'],
        openRunning: '러닝 열기',
        openCompetition: 'SBD 보기',
        quickAccess: 'Offerings',
        quickAccessBody: '핵심 프로그램과 이동 동선을 한 번에 정리했습니다.',
        heroNotes: [
          { title: 'Programs', body: '러닝, 헬스, IGC SBD를 각각 독립된 허브로 구성' },
          { title: 'Mentoring', body: '단계형 신청과 우선 배정 안내를 바로 확인' },
          { title: 'Schedule', body: '시간표와 오픈짐 운영 시간을 한 섹션에 요약' },
        ],
        weeklyReportTitle: 'Weekly Report',
        weeklyReportBody: '주간 활동량을 순위표와 보상 티어로 정리했습니다.',
        tierGuideTitle: 'Tier Reward Guide',
        storiesTitle: '성공 스토리',
        storiesBody: '실제 이용자들의 변화와 후기를 한눈에 확인하세요.',
        mentoringTitle: 'PT 멘토링 프로그램',
        mentoringBody: '러닝 폼, 헬스 루틴, SBD 기록 향상을 위한 1:1 또는 소규모 멘토링을 신청할 수 있습니다.',
        mentoringTrack: '멘토링 트랙',
        mentoringSlot: '희망 시간',
        mentoringGoal: '신청 내용',
        mentoringGoalPlaceholder: '목표, 현재 고민, 원하는 코칭 내용을 적어주세요.',
        mentoringSubmit: '멘토링 신청하기',
        mentoringSuccess: '멘토링 신청이 접수되었습니다. 운영진이 이메일로 안내드릴게요.',
        mentoringSteps: [
          { title: 'Step 1', body: '러닝, 헬스, SBD 중 필요한 트랙을 선택합니다.' },
          { title: 'Step 2', body: '가능한 시간대를 고르고 현재 고민을 간단히 적습니다.' },
          { title: 'Step 3', body: '운영진이 확인 후 배정 일정과 준비사항을 전달합니다.' },
        ],
        scheduleTitle: 'Fitin Connection 시간표',
        scheduleBody: 'Inspire and be inspired',
        sbdNoticeFallback: '학교별 대표 기록과 개인 랭킹을 요약했습니다.',
        leaderboardColumns: ['순위', '이름', '포커스', '포인트', '티어', '보상'],
        reviews: [
          {
            name: '김하늘',
            program: '러닝 8주 프로그램',
            quote: '주 2회 기록만 올렸는데도 5K 기록이 꾸준히 줄었고, 루틴을 지키는 힘이 생겼어요.',
            result: '5K 34분 → 27분',
          },
          {
            name: '박민준',
            program: '헬스 루틴 리빌드',
            quote: '헬스장에서 뭘 해야 할지 몰랐는데, Fitin 루틴 덕분에 상체/하체 분할이 완전히 잡혔어요.',
            result: '주간 운동 1회 → 4회',
          },
          {
            name: '이소연',
            program: 'SBD 챌린지',
            quote: '벤치와 데드리프트 기록이 보이는 구조라 경쟁심이 생겼고, 학교 대표전도 목표로 잡게 됐어요.',
            result: 'Total 255kg → 315kg',
          },
        ],
        scheduleHeaders: ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        scheduleRows: [
          { time: '07:00', values: ['Running', '-', 'Running', '-', '-', '-'] },
          { time: '08:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '09:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '10:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '11:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '12:00-18:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '19:00', values: ['Open Gym', 'PT (selected only)', 'Open Gym', 'Open Gym', 'Open Gym', '-'] },
          { time: '20:00-22:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', '-'] },
        ],
        mentoringTracks: [
          { value: 'running', label: '러닝 폼/페이스 코칭' },
          { value: 'gym', label: '헬스 루틴/근성장 코칭' },
          { value: 'sbd', label: 'SBD 테크닉/기록 향상' },
        ],
        mentoringSlots: ['화요일 19:00', '목요일 19:00', '토요일 10:00'],
        topCards: {
          running: {
            title: 'Running',
            body: '러닝 기록과 거리, 페이스를 빠르게 확인하고 바로 업로드하세요.',
            metrics: ['이번 주 거리', '러닝 세션', '최근 페이스'],
            cta: '러닝 기록 보러가기',
            footer: 'Workout Guide의 러닝 탭으로 이동',
          },
          gym: {
            title: 'Gym / 헬스',
            body: '헬스 루틴과 주간 세션 흐름을 보고 오늘의 분할을 바로 시작할 수 있어요.',
            metrics: ['헬스 세션', '주간 운동 시간', '추천 포커스'],
            cta: '헬스 루틴 열기',
            footer: 'Routine Planner로 바로 이동',
          },
          sbd: {
            title: 'IGC SBD',
            body: '개인 기록과 학교별 순위를 요약해서 바로 경쟁 현황을 확인할 수 있어요.',
            metrics: ['1위 선수', '1위 학교', '최고 Total'],
            cta: 'SBD 순위 보기',
            footer: 'Competition 페이지로 이동',
          },
        },
      }
    : {
        heroKicker: 'Fitin Dashboard',
        heroBody: 'Manage your running, gym, and IGC SBD records in one place, then jump straight into weekly reports and PT mentoring.',
        heroLead: 'A single Fitin Connection hub where activity, rewards, and mentoring all flow together.',
        summaryStats: ['Weekly Score', 'Active Streak', 'Current Tier'],
        openRunning: 'Open Running',
        openCompetition: 'Open SBD',
        quickAccess: 'Offerings',
        quickAccessBody: 'The key programs and navigation paths are laid out in one clean section.',
        heroNotes: [
          { title: 'Programs', body: 'Running, Gym, and IGC SBD each live in their own dedicated hub.' },
          { title: 'Mentoring', body: 'A step-based application flow sits directly on the dashboard.' },
          { title: 'Schedule', body: 'Timetable and open gym availability are summarized at the end.' },
        ],
        weeklyReportTitle: 'Weekly Report',
        weeklyReportBody: 'This week is organized as a ranking table with reward tiers.',
        tierGuideTitle: 'Tier Reward Guide',
        storiesTitle: 'Success Stories',
        storiesBody: 'See what users have achieved with Fitin Connection.',
        mentoringTitle: 'PT Mentoring Program',
        mentoringBody: 'Apply for one-on-one or small-group mentoring for running form, gym planning, and SBD performance.',
        mentoringTrack: 'Mentoring Track',
        mentoringSlot: 'Preferred Time',
        mentoringGoal: 'Application Notes',
        mentoringGoalPlaceholder: 'Share your goal, current issue, and the type of coaching you want.',
        mentoringSubmit: 'Apply for Mentoring',
        mentoringSuccess: 'Your mentoring application has been submitted. We will follow up by email.',
        mentoringSteps: [
          { title: 'Step 1', body: 'Choose the track you want help with: running, gym, or SBD.' },
          { title: 'Step 2', body: 'Pick a time slot and leave a short note about your current goal.' },
          { title: 'Step 3', body: 'The team reviews it and sends back your assigned mentoring plan.' },
        ],
        scheduleTitle: 'Fitin Connection Schedule',
        scheduleBody: 'Inspire and be inspired',
        sbdNoticeFallback: 'A summary of top personal totals and university rankings.',
        leaderboardColumns: ['Rank', 'Name', 'Focus', 'Points', 'Tier', 'Reward'],
        reviews: [
          {
            name: 'Haneul Kim',
            program: '8-Week Running Program',
            quote: 'Just logging two runs a week gave me enough structure to keep improving and finally enjoy the process.',
            result: '5K 34 min -> 27 min',
          },
          {
            name: 'Minjun Park',
            program: 'Gym Routine Rebuild',
            quote: 'I stopped wandering around the gym. The split became clear and I actually started following a plan.',
            result: '1 workout/week -> 4 workouts/week',
          },
          {
            name: 'Soyeon Lee',
            program: 'SBD Challenge',
            quote: 'Seeing my bench and deadlift totals in one place gave me a real target and made the competition feel tangible.',
            result: 'Total 255 kg -> 315 kg',
          },
        ],
        scheduleHeaders: ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        scheduleRows: [
          { time: '07:00', values: ['Running', '-', 'Running', '-', '-', '-'] },
          { time: '08:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '09:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '10:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '11:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '12:00-18:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym'] },
          { time: '19:00', values: ['Open Gym', 'PT (selected only)', 'Open Gym', 'Open Gym', 'Open Gym', '-'] },
          { time: '20:00-22:00', values: ['Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', 'Open Gym', '-'] },
        ],
        mentoringTracks: [
          { value: 'running', label: 'Running form / pace coaching' },
          { value: 'gym', label: 'Gym routine / hypertrophy coaching' },
          { value: 'sbd', label: 'SBD technique / total improvement' },
        ],
        mentoringSlots: ['Tuesday 19:00', 'Thursday 19:00', 'Saturday 10:00'],
        topCards: {
          running: {
            title: 'Running',
            body: 'Review your distance, pace, and recent running uploads in one place.',
            metrics: ['Weekly Distance', 'Running Sessions', 'Recent Pace'],
            cta: 'Open Running Logs',
            footer: 'Jump to the running tab in Workout Guide',
          },
          gym: {
            title: 'Gym',
            body: 'See your gym routine, weekly workload, and today’s recommended split at a glance.',
            metrics: ['Gym Sessions', 'Weekly Minutes', 'Recommended Focus'],
            cta: 'Open Gym Routine',
            footer: 'Jump straight into Routine Planner',
          },
          sbd: {
            title: 'IGC SBD',
            body: 'Get a quick summary of personal totals and university rankings before opening the full leaderboard.',
            metrics: ['Top Athlete', 'Top University', 'Best Total'],
            cta: 'Open SBD Rankings',
            footer: 'Go directly to Competition',
          },
        },
      };

  const storedWorkouts = useMemo<WorkoutLog[]>(
    () => parseStoredArray<WorkoutLog>(`workouts_${user?.email}`),
    [user?.email],
  );

  const runningRecords = useMemo<RunningRecord[]>(
    () => parseStoredArray<RunningRecord>(`running_records_v2_${user?.email}`),
    [user?.email],
  );

  const [sbdStatusText, setSbdStatusText] = useState<string | null>(null);
  const [mentoringTrack, setMentoringTrack] = useState(copy.mentoringTracks[1]?.value ?? 'gym');
  const [mentoringSlot, setMentoringSlot] = useState(copy.mentoringSlots[0]);
  const [mentoringGoal, setMentoringGoal] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    async function fetchSbdStatus() {
      const text = await getGlobalSetting('sbd_status_text');
      if (text) setSbdStatusText(text);
    }

    fetchSbdStatus();
  }, []);

  useEffect(() => {
    setMentoringTrack(copy.mentoringTracks[1]?.value ?? 'gym');
    setMentoringSlot(copy.mentoringSlots[0]);
  }, [isKorean]);

  const now = new Date();
  const seed = getSeed(user?.email || user?.name || 'fitin');
  const todayIndex = mondayBasedIndex(now);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const greeting = (() => {
    const name = user?.name || 'Fitin';
    if (isKorean) {
      if (now.getHours() < 12) return `${name}님, 오늘도 연결됐어요`;
      if (now.getHours() < 18) return `${name}님, 오늘 흐름 좋아요`;
      return `${name}님, 저녁 루틴 준비됐어요`;
    }

    if (now.getHours() < 12) return `You're connected, ${name}`;
    if (now.getHours() < 18) return `Momentum looks good, ${name}`;
    return `Your evening routine is ready, ${name}`;
  })();

  const dateLabel = new Intl.DateTimeFormat(isKorean ? 'ko-KR' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const weeklyWorkoutLogs = storedWorkouts.filter((workout) => new Date(workout.date) >= startOfWeek);
  const runningWorkoutLogs = weeklyWorkoutLogs.filter((workout) => runningPattern.test(workout.type));
  const gymWorkoutLogs = weeklyWorkoutLogs.filter((workout) => !runningPattern.test(workout.type));
  const weeklyRunningRecords = runningRecords.filter((record) => new Date(record.date) >= startOfWeek);
  const totalMinutes = weeklyWorkoutLogs.reduce((acc, workout) => acc + workout.minutes, 0);
  const runningDistanceFromRecords = weeklyRunningRecords.reduce((acc, record) => acc + record.distance, 0);
  const fallbackRunningDistance = runningWorkoutLogs.reduce((acc, workout) => acc + workout.minutes / 11, 0);
  const runningDistance = Number(
    (runningDistanceFromRecords || fallbackRunningDistance || 10 + (seed % 7)).toFixed(1),
  );
  const runningSessions = weeklyRunningRecords.length || runningWorkoutLogs.length || 2 + (seed % 2);
  const gymSessions = gymWorkoutLogs.length || 3 + (seed % 3);
  const gymMinutes = gymWorkoutLogs.reduce((acc, workout) => acc + workout.minutes, 0) || 210 + (seed % 70);
  const latestPace = weeklyRunningRecords[0]?.pace || `6'${String(5 + (seed % 6)).padStart(2, '0')}"`;
  const gymFocusOptions = isKorean
    ? ['하체 + 코어', '등 + 가슴', '어깨 + 팔']
    : ['Lower body + core', 'Back + chest', 'Shoulders + arms'];
  const recommendedFocus = gymFocusOptions[seed % gymFocusOptions.length];
  const weeklyScore = Math.round(totalMinutes + runningDistance * 11 + gymSessions * 26);

  const workoutDates = new Set(storedWorkouts.map((item) => new Date(item.date).toDateString()));
  let streakDays = 0;

  if (storedWorkouts.length === 0) {
    streakDays = 4 + (seed % 3);
  } else {
    const cursor = new Date(now);
    cursor.setHours(0, 0, 0, 0);
    while (workoutDates.has(cursor.toDateString())) {
      streakDays += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const tierMeta = getTierMeta(weeklyScore, isKorean);
  const nextTier = getNextTier(weeklyScore, isKorean);

  const topLifter = [...INITIAL_RECORDS].sort((a, b) => b.total - a.total)[0];
  const universityRankings = UNIVERSITIES.map((uni) => {
    const records = INITIAL_RECORDS.filter((record) => record.universityId === uni.id);
    const total = records.reduce((acc, record) => acc + record.total, 0);
    const average = records.length ? Math.round(total / records.length) : 0;

    return {
      ...uni,
      average,
    };
  }).sort((a, b) => b.average - a.average);
  const topUniversity = universityRankings[0];
  const sbdNotice = sbdStatusText || copy.sbdNoticeFallback;

  const weeklyEntries: WeeklyEntry[] = [
    {
      name: user?.name || (isKorean ? '내 기록' : 'My Record'),
      focus: runningSessions >= gymSessions ? copy.topCards.running.title : copy.topCards.gym.title,
      score: weeklyScore,
    },
    {
      name: isKorean ? 'Marcus' : 'Marcus',
      focus: copy.topCards.running.title,
      score: weeklyScore + 72,
    },
    {
      name: isKorean ? '소연' : 'Soyeon',
      focus: copy.topCards.sbd.title,
      score: Math.max(220, weeklyScore - 18),
    },
    {
      name: isKorean ? 'Daniel' : 'Daniel',
      focus: copy.topCards.gym.title,
      score: Math.max(200, weeklyScore - 64),
    },
    {
      name: isKorean ? '유진' : 'Eugene',
      focus: copy.topCards.running.title,
      score: Math.max(180, weeklyScore - 104),
    },
  ].sort((a, b) => b.score - a.score);

  const topCards = [
    {
      title: copy.topCards.running.title,
      body: copy.topCards.running.body,
      icon: Footprints,
      page: 'workout' as Page,
      navigation: { workoutTab: 'running' as WorkoutTab },
      accentClass: 'from-[#0f172a] via-[#164fbb] to-[#56a6ff]',
      chipClass: 'bg-white/18 text-white',
      metrics: [
        { label: copy.topCards.running.metrics[0], value: `${runningDistance} km` },
        { label: copy.topCards.running.metrics[1], value: `${runningSessions}` },
        { label: copy.topCards.running.metrics[2], value: latestPace },
      ],
      cta: copy.topCards.running.cta,
      footer: copy.topCards.running.footer,
    },
    {
      title: copy.topCards.gym.title,
      body: copy.topCards.gym.body,
      icon: Dumbbell,
      page: 'workout' as Page,
      navigation: { workoutTab: 'routine' as WorkoutTab, routineSubTab: 'planner' as RoutineSubTab },
      accentClass: 'from-[#30261d] via-[#6e4b22] to-[#d39746]',
      chipClass: 'bg-white/18 text-white',
      metrics: [
        { label: copy.topCards.gym.metrics[0], value: `${gymSessions}` },
        { label: copy.topCards.gym.metrics[1], value: `${gymMinutes} min` },
        { label: copy.topCards.gym.metrics[2], value: recommendedFocus },
      ],
      cta: copy.topCards.gym.cta,
      footer: copy.topCards.gym.footer,
    },
    {
      title: copy.topCards.sbd.title,
      body: copy.topCards.sbd.body,
      icon: Trophy,
      page: 'competition' as Page,
      navigation: undefined,
      accentClass: 'from-[#121418] via-[#1e2c44] to-[#394f7e]',
      chipClass: 'bg-white/18 text-white',
      metrics: [
        { label: copy.topCards.sbd.metrics[0], value: topLifter?.userName || '-' },
        { label: copy.topCards.sbd.metrics[1], value: topUniversity?.name || '-' },
        { label: copy.topCards.sbd.metrics[2], value: `${topLifter?.total || 0} kg` },
      ],
      cta: copy.topCards.sbd.cta,
      footer: copy.topCards.sbd.footer,
      notice: sbdNotice,
    },
  ];

  const handleMentoringSubmit = () => {
    if (!mentoringGoal.trim()) {
      alert(isKorean ? '신청 내용을 입력해주세요.' : 'Please add a short note for your application.');
      return;
    }

    if (typeof window === 'undefined') return;

    const nextItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: user?.name || 'Fitin User',
      email: user?.email || '',
      track: mentoringTrack,
      slot: mentoringSlot,
      goal: mentoringGoal.trim(),
      createdAt: new Date().toISOString(),
    };

    const key = 'fitin_pt_mentoring_requests_v1';
    const previous = parseStoredArray<typeof nextItem>(key);
    localStorage.setItem(key, JSON.stringify([nextItem, ...previous]));
    setMentoringGoal('');
    setApplicationMessage(copy.mentoringSuccess);
  };

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
            <header className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
              <div className="space-y-6">
                <div>
                  <p className="apple-kicker">{copy.heroKicker}</p>
                  <h1 className="mt-4 text-[clamp(2.25rem,4.8vw,4.5rem)] font-black leading-[0.94] tracking-[-0.08em] text-foreground">
                    {greeting}
                    <span className="text-primary">.</span>
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                    {dateLabel}. {copy.heroBody}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/74 sm:text-base">
                    {copy.heroLead}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <p className="apple-kicker">{copy.quickAccess}</p>
                      <h2 className="mt-2 text-[1.95rem] font-black tracking-[-0.06em] text-foreground">
                        Running, Gym, SBD
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.quickAccessBody}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {topCards.map((card) => {
                      const Icon = card.icon;

                      return (
                        <button
                          key={card.title}
                          type="button"
                          onClick={() => onNavigate(card.page, card.navigation)}
                          className={`group relative overflow-hidden rounded-[34px] bg-gradient-to-br ${card.accentClass} p-6 text-left text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-1 sm:p-7`}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_84%_22%,rgba(255,255,255,0.14),transparent_24%)]" />
                          <div className="relative flex h-full flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,1.12fr)] lg:gap-6">
                            <div className="flex h-full flex-col">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${card.chipClass}`}>
                                    {copy.quickAccess}
                                  </span>
                                  <h3 className="mt-4 text-[2rem] font-black tracking-[-0.06em] sm:text-[2.2rem]">
                                    {card.title}
                                  </h3>
                                </div>
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/14">
                                  <Icon className="h-5 w-5" />
                                </span>
                              </div>

                              <p className="mt-5 max-w-[42ch] text-sm leading-6 text-white/78">{card.body}</p>

                              <div className="mt-6 lg:mt-auto lg:pt-6">
                                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                  {card.cta}
                                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/56">{card.footer}</p>
                              </div>
                            </div>

                            <div className="grid gap-3 lg:content-start">
                              <div className="grid gap-3 sm:grid-cols-3">
                                {card.metrics.map((metric) => (
                                  <div key={metric.label} className="rounded-[22px] border border-white/16 bg-white/10 px-4 py-4 backdrop-blur-md">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/64">{metric.label}</p>
                                    <p className="mt-2 text-xl font-black tracking-[-0.04em]">{metric.value}</p>
                                  </div>
                                ))}
                              </div>

                              {card.notice ? (
                                <div className="rounded-[22px] border border-white/14 bg-black/14 px-4 py-4 text-sm leading-6 text-white/78">
                                  {card.notice}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="apple-micro-card">
                    <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {copy.summaryStats[0]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">{weeklyScore} pt</p>
                  </div>
                  <div className="apple-micro-card">
                    <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {copy.summaryStats[1]}
                    </p>
                    <p className="mt-2 text-[1.55rem] font-black tracking-[-0.05em] text-foreground">{streakDays}d</p>
                  </div>
                  <div className="apple-micro-card">
                    <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {copy.summaryStats[2]}
                    </p>
                    <p className={`mt-2 text-[1.55rem] font-black tracking-[-0.05em] ${tierMeta.textClass}`}>
                      {tierMeta.label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="apple-panel flex flex-col justify-between p-6 sm:p-7">
                <div>
                  <p className="apple-kicker">{copy.quickAccess}</p>
                  <h2 className="mt-3 text-[1.8rem] font-black tracking-[-0.06em] text-foreground">
                    Fitin Connection
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.quickAccessBody}</p>
                </div>

                <div className="mt-6 space-y-3">
                  {copy.heroNotes.map((note) => (
                    <div key={note.title} className="apple-soft-card px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        {note.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground/76">{note.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('workout', { workoutTab: 'running' })}
                    className="apple-ghost-button gap-2 px-5"
                  >
                    <Footprints className="h-4 w-4 text-primary" />
                    {copy.openRunning}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('competition')}
                    className="apple-button gap-2 px-6"
                  >
                    <Trophy className="h-4 w-4" />
                    {copy.openCompetition}
                  </button>
                </div>
              </div>
            </header>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="apple-panel p-6 sm:p-8"
          >
            <div className="grid gap-8 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
              <div className="space-y-5">
                <div>
                  <p className="apple-kicker">{copy.weeklyReportTitle}</p>
                  <h2 className="mt-3 text-[2rem] font-black tracking-[-0.06em] text-foreground">
                    {copy.weeklyReportTitle}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{copy.weeklyReportBody}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.tierGuideTitle}
                  </p>
                  {tierThresholds.map((tier) => (
                    <div key={tier.key} className={`rounded-[24px] border px-4 py-4 ${tier.cardClass}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${tier.chipClass}`}>
                            {tier.label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {tier.key === 'bronze' ? '0+' : tier.key === 'silver' ? '260+' : '420+'} pt
                          </span>
                        </div>
                        {tierMeta.key === tier.key ? (
                          <span className="text-sm font-semibold text-foreground">{isKorean ? '현재 티어' : 'Current tier'}</span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-foreground/82">
                        {isKorean ? tier.rewardKo : tier.rewardEn}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[26px] bg-[linear-gradient(135deg,#10131a,#1f3e75)] p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                        {isKorean ? '이번 주 보상' : 'Weekly reward'}
                      </p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.05em]">{tierMeta.label}</p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/12">
                      <Award className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/76">{tierMeta.reward}</p>
                  <div className="mt-5 rounded-[20px] border border-white/12 bg-white/10 px-4 py-4">
                    {nextTier ? (
                      <p className="text-sm leading-6 text-white/78">
                        {isKorean
                          ? `${nextTier.label}까지 ${nextTier.remaining}pt 남았어요.`
                          : `${nextTier.remaining} points left to reach ${nextTier.label}.`}
                      </p>
                    ) : (
                      <p className="text-sm leading-6 text-white/78">
                        {isKorean ? '최상위 티어를 유지하고 있어요. 지금 흐름을 이어가세요.' : 'You are already in the top tier. Keep the momentum going.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="apple-kicker">{copy.weeklyReportTitle}</p>
                    <h3 className="mt-2 text-[1.7rem] font-black tracking-[-0.05em] text-foreground">
                      {isKorean ? '주간 순위표' : 'Weekly Leaderboard'}
                    </h3>
                  </div>
                  <span className="apple-chip">
                    <Medal className="h-3.5 w-3.5" />
                    {weeklyEntries.length}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-[26px] border border-white/80 bg-white/72">
                  <table className="min-w-full text-left">
                    <thead className="bg-slate-50/90">
                      <tr>
                        {copy.leaderboardColumns.map((column) => (
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
                      {weeklyEntries.map((entry, index) => {
                        const entryTier = getTierMeta(entry.score, isKorean);
                        const isCurrentUser = entry.name === (user?.name || (isKorean ? '내 기록' : 'My Record'));

                        return (
                          <tr
                            key={`${entry.name}_${entry.score}`}
                            className={`${isCurrentUser ? 'bg-blue-50/70' : 'bg-white/75'} border-t border-slate-100`}
                          >
                            <td className="px-4 py-4 text-sm font-bold text-foreground">{index + 1}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-foreground">
                                  {entry.name.charAt(0)}
                                </span>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                                  {isCurrentUser ? (
                                    <p className="text-xs text-primary">{isKorean ? '내 기록' : 'Your entry'}</p>
                                  ) : null}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{entry.focus}</td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-foreground">{entry.score} pt</td>
                            <td className="px-4 py-4">
                              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${entryTier.chipClass}`}>
                                {entryTier.label}
                              </span>
                            </td>
                            <td className="min-w-[220px] px-4 py-4 text-sm text-muted-foreground">{entryTier.reward}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
          >
            <div className="apple-panel p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="apple-kicker">{copy.storiesTitle}</p>
                  <h2 className="mt-2 text-[1.75rem] font-black tracking-[-0.05em] text-foreground">
                    {copy.storiesTitle}
                  </h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                  <Star className="h-5 w-5" />
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.storiesBody}</p>

              <div className="mt-6 space-y-4">
                {copy.reviews.map((review) => (
                  <div key={review.name} className="apple-soft-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-black tracking-[-0.04em] text-foreground">{review.name}</p>
                        <p className="text-sm text-primary">{review.program}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {review.result}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">"{review.quote}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="apple-panel p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="apple-kicker">{copy.mentoringTitle}</p>
                  <h2 className="mt-2 text-[1.75rem] font-black tracking-[-0.05em] text-foreground">
                    {copy.mentoringTitle}
                  </h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-primary">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.mentoringBody}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {copy.mentoringSteps.map((step, index) => (
                  <div key={step.title} className="apple-soft-card px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {step.title}
                    </p>
                    <p className="mt-2 text-base font-black tracking-[-0.04em] text-foreground">
                      {index === 0
                        ? isKorean ? '트랙 선택' : 'Pick Track'
                        : index === 1
                          ? isKorean ? '시간/목표 작성' : 'Select Slot'
                          : isKorean ? '배정 안내' : 'Get Assigned'}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.mentoringTrack}
                  </Label>
                  <select
                    value={mentoringTrack}
                    onChange={(event) => setMentoringTrack(event.target.value)}
                    className="apple-input w-full border-0 bg-white/92 text-foreground"
                  >
                    {copy.mentoringTracks.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.mentoringSlot}
                  </Label>
                  <select
                    value={mentoringSlot}
                    onChange={(event) => setMentoringSlot(event.target.value)}
                    className="apple-input w-full border-0 bg-white/92 text-foreground"
                  >
                    {copy.mentoringSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {copy.mentoringGoal}
                  </Label>
                  <Textarea
                    value={mentoringGoal}
                    onChange={(event) => setMentoringGoal(event.target.value)}
                    placeholder={copy.mentoringGoalPlaceholder}
                    className="apple-input min-h-[140px] border-0 bg-white/92 py-4 text-base text-foreground"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <Input
                    value={user?.email || ''}
                    readOnly
                    className="apple-input border-0 bg-slate-50 text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={handleMentoringSubmit}
                    className="apple-button h-14 px-6"
                  >
                    {copy.mentoringSubmit}
                  </button>
                </div>

                {applicationMessage ? (
                  <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-700">
                    {applicationMessage}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[34px] bg-[linear-gradient(160deg,#162126,#24353d_48%,#111a1f)] p-6 text-white shadow-[0_28px_80px_rgba(17,24,39,0.18)] sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <img src="/fitin-wordmark.svg" alt="Fitin Connection" className="h-12 w-auto rounded-[18px] object-contain" />
                <h2 className="mt-5 text-[1.95rem] font-black tracking-[-0.06em] text-white">
                  {copy.scheduleTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/68">{copy.scheduleBody}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">
                    {isKorean ? '러닝' : 'Running'}
                  </p>
                  <p className="mt-2 text-xl font-black">Mon / Wed 07:00</p>
                </div>
                <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">
                    {isKorean ? '오픈짐' : 'Open Gym'}
                  </p>
                  <p className="mt-2 text-xl font-black">08:00-22:00</p>
                </div>
                <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">
                    {isKorean ? 'PT' : 'PT'}
                  </p>
                  <p className="mt-2 text-xl font-black">{isKorean ? '화 19:00' : 'Tue 19:00'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto rounded-[28px] border border-white/12 bg-black/12">
              <table className="min-w-full text-left">
                <thead className="bg-white/10">
                  <tr>
                    {copy.scheduleHeaders.map((header) => (
                      <th
                        key={header}
                        className="whitespace-nowrap px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/70"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {copy.scheduleRows.map((row) => (
                    <tr key={row.time} className="border-t border-white/8">
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-white/72">{row.time}</td>
                      {row.values.map((value, index) => {
                        const isRunning = value === 'Running';
                        const isPt = value.includes('PT');

                        return (
                          <td key={`${row.time}_${index}`} className="px-4 py-4">
                            <span
                              className={`inline-flex min-w-[120px] justify-center rounded-[16px] px-3 py-3 text-sm font-semibold ${
                                value === '-'
                                  ? 'text-white/24'
                                  : isRunning
                                    ? 'bg-white text-slate-900'
                                    : isPt
                                      ? 'bg-amber-50 text-slate-900'
                                      : 'bg-white/10 text-white/84'
                              }`}
                            >
                              {value}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
