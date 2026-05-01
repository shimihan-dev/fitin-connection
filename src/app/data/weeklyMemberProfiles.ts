export interface WeeklyTierMeta {
  key: 'bronze' | 'silver' | 'gold';
  min: number;
  label: string;
  rewardKo: string;
  rewardEn: string;
  cardClass: string;
  chipClass: string;
  textClass: string;
}

export interface MemberGoalMetric {
  label: string;
  actual: number;
  target: number;
  unit: string;
}

export interface MemberDailyTrend {
  label: string;
  shortLabel: string;
  durationMinutes: number;
  volumeKg: number;
  focus: string;
}

export interface MemberHighlight {
  label: string;
  value: string;
  hint: string;
}

export interface WeeklyMemberProfile {
  id: string;
  name: string;
  university: string;
  focus: string;
  sourceLabel: string;
  sourceType: 'actual' | 'derived';
  primaryGoal: string;
  score: number;
  streakDays: number;
  trainingDays: number;
  targetDays: number;
  weeklyMinutes: number;
  volumeKg: number;
  volumeEstimated?: boolean;
  calories?: number;
  goalMetrics: MemberGoalMetric[];
  dailyTrend: MemberDailyTrend[];
  highlights: MemberHighlight[];
  routineSummary: string[];
}

export const weeklyTierThresholds: WeeklyTierMeta[] = [
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

export function getWeeklyTierMeta(score: number, isKorean: boolean) {
  const tier =
    [...weeklyTierThresholds].reverse().find((item) => score >= item.min) ??
    weeklyTierThresholds[0];

  return {
    ...tier,
    reward: isKorean ? tier.rewardKo : tier.rewardEn,
  };
}

export function getNextWeeklyTier(score: number, isKorean: boolean) {
  const nextTier = weeklyTierThresholds.find((item) => score < item.min);

  if (!nextTier) {
    return null;
  }

  return {
    ...nextTier,
    reward: isKorean ? nextTier.rewardKo : nextTier.rewardEn,
    remaining: nextTier.min - score,
  };
}

export const weeklyMemberProfiles: WeeklyMemberProfile[] = [
  {
    id: 'hwang-jewoong',
    name: '황제웅',
    university: 'Utah University',
    focus: 'Pull / Push density',
    sourceLabel: 'Weekly Workout Analysis.xlsx',
    sourceType: 'actual',
    primaryGoal: '고밀도 상체 분할을 유지하면서 주간 볼륨 85톤 이상 달성',
    score: 327,
    streakDays: 3,
    trainingDays: 7,
    targetDays: 8,
    weeklyMinutes: 535,
    volumeKg: 90767,
    calories: 2307,
    goalMetrics: [
      { label: '운동일', actual: 7, target: 8, unit: '일' },
      { label: '운동 시간', actual: 535, target: 480, unit: '분' },
      { label: '누적 볼륨', actual: 90767, target: 85000, unit: 'kg' },
    ],
    dailyTrend: [
      { label: '4/13 Mon', shortLabel: 'Mon', durationMinutes: 76, volumeKg: 14838, focus: '등 + 이두' },
      { label: '4/14 Tue', shortLabel: 'Tue', durationMinutes: 64, volumeKg: 9624, focus: '어깨' },
      { label: '4/15 Wed', shortLabel: 'Wed', durationMinutes: 72, volumeKg: 13837, focus: '가슴' },
      { label: '4/16 Thu', shortLabel: 'Thu', durationMinutes: 65, volumeKg: 9860, focus: '팔' },
      { label: '4/17 Fri', shortLabel: 'Fri', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
      { label: '4/18 Sat', shortLabel: 'Sat', durationMinutes: 94, volumeKg: 12053, focus: '어깨' },
      { label: '4/19 Sun', shortLabel: 'Sun', durationMinutes: 82, volumeKg: 15979, focus: '가슴 + 삼두' },
      { label: '4/20 Mon', shortLabel: 'Mon+', durationMinutes: 82, volumeKg: 14576, focus: '등 + 이두' },
    ],
    highlights: [
      { label: '최고 세션', value: '15,979 kg', hint: '4/19 가슴 + 삼두 세션' },
      { label: '성장 지표', value: '바벨 컬 +23.9%', hint: 'e1RM 28.0 -> 34.7kg' },
      { label: '주력 부위', value: '등 38.7%', hint: '주간 누적 볼륨 비중' },
    ],
    routineSummary: [
      '8일 추적 구간 중 7일 훈련으로 87.5% 출석률을 기록했습니다.',
      '일평균 운동 시간은 76.4분, 시간당 볼륨 효율은 169.7kg/min입니다.',
      '주간 최고 성장 종목은 바벨 컬과 케이블 로프 푸쉬다운이었습니다.',
    ],
  },
  {
    id: 'jung-hyun',
    name: '정현',
    university: 'Ghent University',
    focus: '6-day hypertrophy split',
    sourceLabel: 'Fitin Data Tracking.docx 탭 4',
    sourceType: 'derived',
    primaryGoal: '메인 + 사이드 분할을 주 6일 유지하면서 고중량 날의 밀도까지 확보',
    score: 309,
    streakDays: 6,
    trainingDays: 6,
    targetDays: 6,
    weeklyMinutes: 492,
    volumeKg: 88400,
    volumeEstimated: true,
    goalMetrics: [
      { label: '운동일', actual: 6, target: 6, unit: '일' },
      { label: '운동 시간', actual: 492, target: 450, unit: '분' },
      { label: '고중량 복합 루틴', actual: 4, target: 4, unit: '회' },
    ],
    dailyTrend: [
      { label: 'Mon', shortLabel: 'Mon', durationMinutes: 86, volumeKg: 14700, focus: '가슴 + 삼두' },
      { label: 'Tue', shortLabel: 'Tue', durationMinutes: 82, volumeKg: 14400, focus: '등 + 이두' },
      { label: 'Wed', shortLabel: 'Wed', durationMinutes: 74, volumeKg: 12200, focus: '어깨 + 삼두' },
      { label: 'Thu', shortLabel: 'Thu', durationMinutes: 96, volumeKg: 17800, focus: '하체 + 이두' },
      { label: 'Fri', shortLabel: 'Fri', durationMinutes: 78, volumeKg: 14100, focus: '가슴 + 삼두' },
      { label: 'Sat', shortLabel: 'Sat', durationMinutes: 76, volumeKg: 15200, focus: '등 + 후면삼각근' },
      { label: 'Sun', shortLabel: 'Sun', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
    ],
    highlights: [
      { label: '최고 세션', value: '17,800 kg', hint: '하체 루틴 데이 추정치' },
      { label: '중량 기준', value: '벤치 140 / 데드 200', hint: '문서 내 PR 체크 세트 기준' },
      { label: '운영 방식', value: '휴식 30초 내외', hint: '고중량 종목만 충분한 회복' },
    ],
    routineSummary: [
      '가슴, 등, 어깨, 하체에 사이드 부위를 붙이는 6일 분할입니다.',
      'PR은 매번 시도하지 않고 2회당 1회 정도만 체크하는 방식입니다.',
      '문서에 적힌 세트/빈도를 기준으로 일별 부하와 볼륨을 추정했습니다.',
    ],
  },
  {
    id: 'kang-philip',
    name: '강필립',
    university: 'Mason Korea',
    focus: 'Powerbuilding hybrid',
    sourceLabel: 'Fitin Data Tracking.docx 탭 6',
    sourceType: 'derived',
    primaryGoal: '3대 585 베이스를 보디빌딩식 볼륨으로 소화하고 파워블록으로 연결',
    score: 288,
    streakDays: 2,
    trainingDays: 4,
    targetDays: 4,
    weeklyMinutes: 344,
    volumeKg: 62100,
    volumeEstimated: true,
    goalMetrics: [
      { label: '운동일', actual: 4, target: 4, unit: '일' },
      { label: '운동 시간', actual: 344, target: 320, unit: '분' },
      { label: '보디빌딩 분할 완수', actual: 4, target: 4, unit: '회' },
    ],
    dailyTrend: [
      { label: 'Mon', shortLabel: 'Mon', durationMinutes: 92, volumeKg: 15400, focus: '가슴 + 어깨 + 삼두' },
      { label: 'Tue', shortLabel: 'Tue', durationMinutes: 84, volumeKg: 13900, focus: '등 + 이두' },
      { label: 'Wed', shortLabel: 'Wed', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
      { label: 'Thu', shortLabel: 'Thu', durationMinutes: 72, volumeKg: 11200, focus: '팔' },
      { label: 'Fri', shortLabel: 'Fri', durationMinutes: 96, volumeKg: 21600, focus: '하체' },
      { label: 'Sat', shortLabel: 'Sat', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
      { label: 'Sun', shortLabel: 'Sun', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
    ],
    highlights: [
      { label: '기준 기록', value: '합계 585kg', hint: '벤치 115 / 스쿼트 230 / 데드 240' },
      { label: '최고 세션', value: '21,600 kg', hint: '하체 데이 추정치' },
      { label: '블록 구성', value: 'BB -> Power', hint: '보디빌딩 후 파워빌딩 블록 연결' },
    ],
    routineSummary: [
      '주간 전반은 보디빌딩 식 반복수 중심, 후반은 파워빌딩 전환 루틴이 이어집니다.',
      '가슴/등/팔/하체 4일 분할을 기준으로 주간 훈련량을 계산했습니다.',
      '무게가 명시되지 않은 세트는 3대 585 기준 평균 강도로 환산했습니다.',
    ],
  },
  {
    id: 'jungwoo',
    name: '정우',
    university: 'SUNY',
    focus: 'Classic push / pull / legs',
    sourceLabel: 'Fitin Data Tracking.docx 탭 1',
    sourceType: 'derived',
    primaryGoal: '월~수 고강도, 목~토 보완 루틴으로 6일 연속 흐름 유지',
    score: 272,
    streakDays: 6,
    trainingDays: 6,
    targetDays: 6,
    weeklyMinutes: 401,
    volumeKg: 62400,
    volumeEstimated: true,
    goalMetrics: [
      { label: '운동일', actual: 6, target: 6, unit: '일' },
      { label: '운동 시간', actual: 401, target: 360, unit: '분' },
      { label: '하체 메인 세션', actual: 2, target: 2, unit: '회' },
    ],
    dailyTrend: [
      { label: 'Mon', shortLabel: 'Mon', durationMinutes: 78, volumeKg: 12800, focus: '가슴' },
      { label: 'Tue', shortLabel: 'Tue', durationMinutes: 74, volumeKg: 11900, focus: '등' },
      { label: 'Wed', shortLabel: 'Wed', durationMinutes: 82, volumeKg: 14100, focus: '하체' },
      { label: 'Thu', shortLabel: 'Thu', durationMinutes: 58, volumeKg: 8100, focus: '상체 보완' },
      { label: 'Fri', shortLabel: 'Fri', durationMinutes: 55, volumeKg: 7900, focus: '등 보완' },
      { label: 'Sat', shortLabel: 'Sat', durationMinutes: 54, volumeKg: 7600, focus: '하체 + 코어' },
      { label: 'Sun', shortLabel: 'Sun', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
    ],
    highlights: [
      { label: '상체 기준', value: '벤치 80kg', hint: '월요일 메인 세트 기준' },
      { label: '하체 기준', value: '데드 120kg', hint: '격주 하체 메인 최고 중량' },
      { label: '루틴 구조', value: '목~토 강도 조절', hint: '고강도 이후 저강도 보완' },
    ],
    routineSummary: [
      '월 가슴, 화 등, 수 하체에 목~토 보완 세션을 더하는 구조입니다.',
      '문서에 적힌 세트 수와 중량을 기준으로 주간 볼륨을 추정했습니다.',
      '주 6일 출석이 강점이고, 하체 세션의 강도 변주가 명확합니다.',
    ],
  },
  {
    id: 'hwang-chanwoo',
    name: '황찬우',
    university: 'Utah University',
    focus: '4-week strength base',
    sourceLabel: 'Fitin Data Tracking.docx 탭 5',
    sourceType: 'derived',
    primaryGoal: '4주 루틴 안에서 하체와 인클라인 프레스 중량을 단계적으로 상승',
    score: 246,
    streakDays: 3,
    trainingDays: 4,
    targetDays: 4,
    weeklyMinutes: 295,
    volumeKg: 49800,
    volumeEstimated: true,
    goalMetrics: [
      { label: '운동일', actual: 4, target: 4, unit: '일' },
      { label: '운동 시간', actual: 295, target: 280, unit: '분' },
      { label: '주요 복합 리프트', actual: 4, target: 4, unit: '회' },
    ],
    dailyTrend: [
      { label: 'Mon', shortLabel: 'Mon', durationMinutes: 71, volumeKg: 10800, focus: '인클라인 가슴' },
      { label: 'Tue', shortLabel: 'Tue', durationMinutes: 83, volumeKg: 15300, focus: '하체' },
      { label: 'Wed', shortLabel: 'Wed', durationMinutes: 77, volumeKg: 13900, focus: '등 + 후면사슬' },
      { label: 'Thu', shortLabel: 'Thu', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
      { label: 'Fri', shortLabel: 'Fri', durationMinutes: 64, volumeKg: 9800, focus: '어깨' },
      { label: 'Sat', shortLabel: 'Sat', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
      { label: 'Sun', shortLabel: 'Sun', durationMinutes: 0, volumeKg: 0, focus: '휴식' },
    ],
    highlights: [
      { label: '하체 진행', value: '스쿼트 100kg x3', hint: '4주차 화요일 기록 기준' },
      { label: '기계 볼륨', value: '레그프레스 210kg', hint: '3~4주차 상단 세트 기준' },
      { label: '상체 진행', value: '인클라인 70kg', hint: '4주차 상단 세트 기준' },
    ],
    routineSummary: [
      '월/화/수/금 4일 분할을 4주간 반복하면서 점진적 증량을 시도합니다.',
      '현재 차트는 가장 완성도가 높은 3주차 흐름과 4주차 최고 중량을 반영했습니다.',
      '문서에 적힌 세트/중량 기록으로 일별 시간과 볼륨을 추정했습니다.',
    ],
  },
];
