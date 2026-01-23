import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, TrendingUp, Target, Clock, ChevronRight, Plus, Check, Calendar, X, Footprints, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RoutinePlanner } from './RoutinePlanner';
import { Diet } from './Diet';

interface MuscleGroup {
  id: string;
  name: string;
  nameEn: string;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  duration: string;
  sets: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tips: string[];
}

interface WorkoutLog {
  id: string;
  date: string;
  muscleId: string;
  exerciseName: string;
  sets: number;
  reps: number;
}

interface WorkoutGuideProps {
  user: { name: string; email: string } | null;
}

// 근육 그룹 데이터
const muscleGroups: Record<string, MuscleGroup[]> = {
  upper: [
    {
      id: 'shoulder',
      name: '어깨',
      nameEn: 'Shoulders',
      exercises: [
        { name: '덤벨 숄더 프레스', duration: '12-15회', sets: '3세트', difficulty: 'intermediate', tips: ['가벼운 무게로 시작', '코어를 단단히 유지'] },
        { name: '사이드 레터럴 레이즈', duration: '15회', sets: '3세트', difficulty: 'beginner', tips: ['어깨보다 높이 올리지 않기'] },
        { name: '프론트 레이즈', duration: '12회', sets: '3세트', difficulty: 'beginner', tips: ['반동 사용하지 않기'] },
      ],
    },
    {
      id: 'chest',
      name: '가슴',
      nameEn: 'Chest',
      exercises: [
        { name: '푸쉬업', duration: '10-15회', sets: '3세트', difficulty: 'beginner', tips: ['팔꿈치 45도 각도'] },
        { name: '인클라인 푸쉬업', duration: '12회', sets: '3세트', difficulty: 'beginner', tips: ['초보자에게 적합'] },
        { name: '덤벨 체스트 프레스', duration: '12회', sets: '3세트', difficulty: 'intermediate', tips: ['등을 평평하게'] },
      ],
    },
    {
      id: 'back',
      name: '등',
      nameEn: 'Back',
      exercises: [
        { name: '덤벨 로우', duration: '12회', sets: '각 팔 3세트', difficulty: 'intermediate', tips: ['등을 평평하게 유지'] },
        { name: '슈퍼맨', duration: '10회', sets: '3세트', difficulty: 'beginner', tips: ['팔과 다리를 동시에 들어올리기'] },
        { name: '풀업 (보조)', duration: '5-8회', sets: '3세트', difficulty: 'advanced', tips: ['등 근육에 집중'] },
      ],
    },
    {
      id: 'bicep',
      name: '이두',
      nameEn: 'Biceps',
      exercises: [
        { name: '덤벨 컬', duration: '12-15회', sets: '3세트', difficulty: 'beginner', tips: ['팔꿈치 고정'] },
        { name: '해머 컬', duration: '12회', sets: '3세트', difficulty: 'beginner', tips: ['전완근도 함께 자극'] },
        { name: '컨센트레이션 컬', duration: '10회', sets: '각 팔 3세트', difficulty: 'intermediate', tips: ['앉아서 팔꿈치를 무릎 안쪽에 고정'] },
      ],
    },
    {
      id: 'tricep',
      name: '삼두',
      nameEn: 'Triceps',
      exercises: [
        { name: '트라이셉스 딥스', duration: '10-12회', sets: '3세트', difficulty: 'intermediate', tips: ['팔꿈치 90도까지 내리기'] },
        { name: '오버헤드 익스텐션', duration: '12회', sets: '3세트', difficulty: 'intermediate', tips: ['팔꿈치 고정'] },
        { name: '다이아몬드 푸쉬업', duration: '8-10회', sets: '3세트', difficulty: 'advanced', tips: ['삼두에 집중'] },
      ],
    },
  ],
  lower: [
    {
      id: 'quadriceps',
      name: '대퇴사두',
      nameEn: 'Quadriceps',
      exercises: [
        { name: '스쿼트', duration: '15-20회', sets: '3세트', difficulty: 'beginner', tips: ['무릎이 발끝을 넘지 않게'] },
        { name: '레그 익스텐션', duration: '12회', sets: '3세트', difficulty: 'intermediate', tips: ['천천히 컨트롤'] },
        { name: '불가리안 스플릿 스쿼트', duration: '10회', sets: '각 다리 3세트', difficulty: 'advanced', tips: ['뒷발을 벤치에 올려놓고'] },
      ],
    },
    {
      id: 'hamstring',
      name: '햄스트링',
      nameEn: 'Hamstrings',
      exercises: [
        { name: '루마니안 데드리프트', duration: '12회', sets: '3세트', difficulty: 'intermediate', tips: ['햄스트링 늘어나는 느낌'] },
        { name: '레그 컬', duration: '12회', sets: '3세트', difficulty: 'intermediate', tips: ['엉덩이 들리지 않게'] },
      ],
    },
    {
      id: 'glutes',
      name: '둔근',
      nameEn: 'Glutes',
      exercises: [
        { name: '힙 쓰러스트', duration: '15회', sets: '3세트', difficulty: 'intermediate', tips: ['엉덩이 최대한 조이기'] },
        { name: '글루트 브릿지', duration: '15회', sets: '3세트', difficulty: 'beginner', tips: ['엉덩이 들어올리기'] },
        { name: '덩키 킥', duration: '15회', sets: '각 다리 3세트', difficulty: 'beginner', tips: ['다리를 뒤로 차올리기'] },
      ],
    },
    {
      id: 'calves',
      name: '종아리',
      nameEn: 'Calves',
      exercises: [
        { name: '카프 레이즈', duration: '20회', sets: '3세트', difficulty: 'beginner', tips: ['최대한 높이'] },
        { name: '시티드 카프 레이즈', duration: '15회', sets: '3세트', difficulty: 'beginner', tips: ['발끝 들어올리기'] },
      ],
    },
  ],
  core: [
    {
      id: 'abs',
      name: '복근',
      nameEn: 'Abs',
      exercises: [
        { name: '크런치', duration: '15-20회', sets: '3세트', difficulty: 'beginner', tips: ['목 당기지 않기'] },
        { name: '레그 레이즈', duration: '12회', sets: '3세트', difficulty: 'intermediate', tips: ['다리 천천히 올리기'] },
        { name: '플랭크', duration: '30-60초', sets: '3세트', difficulty: 'beginner', tips: ['엉덩이 처지지 않게'] },
        { name: '시티드 니업', duration: '15회', sets: '3세트', difficulty: 'intermediate', tips: ['상복부 하복부 동시 자극'] },
      ],
    },
    {
      id: 'obliques',
      name: '복사근',
      nameEn: 'Obliques',
      exercises: [
        { name: '바이시클 크런치', duration: '각 12회', sets: '3세트', difficulty: 'intermediate', tips: ['반대쪽 팔꿈치와 무릎 터치'] },
        { name: '사이드 플랭크', duration: '30초', sets: '각 측면 3세트', difficulty: 'intermediate', tips: ['옆으로 누워 팔꿈치로 지탱'] },
        { name: '러시안 트위스트', duration: '20회', sets: '3세트', difficulty: 'intermediate', tips: ['상체 비틀기'] },
      ],
    },
    {
      id: 'lowerback',
      name: '허리',
      nameEn: 'Lower Back',
      exercises: [
        { name: '슈퍼맨', duration: '10회', sets: '3세트', difficulty: 'beginner', tips: ['3초간 유지'] },
        { name: '버드독', duration: '10회', sets: '각 측면 3세트', difficulty: 'beginner', tips: ['균형 유지'] },
        { name: '백 익스텐션', duration: '12회', sets: '3세트', difficulty: 'intermediate', tips: ['허리 과신전 주의'] },
      ],
    },
  ],
};

// 고해상도 해부학 SVG 경로 데이터
const anatomyPaths = {
  // 분리된 바디 실루엣 (머리, 목, 몸통, 팔, 다리)
  head: "M120 15 C102 15 90 32 90 52 C90 72 102 85 120 85 C138 85 150 72 150 52 C150 32 138 15 120 15 Z",
  neck: "M108 85 L108 100 L132 100 L132 85 Z",
  torso: "M70 100 Q55 105 52 120 L48 180 Q45 220 50 260 L55 290 Q70 300 90 305 L120 308 L150 305 Q170 300 185 290 L190 260 Q195 220 192 180 L188 120 Q185 105 170 100 Z",
  leftArm: "M52 115 Q38 120 30 140 L22 180 Q18 210 22 240 L28 270 Q32 285 40 280 L48 250 Q52 220 50 190 L52 150 Q54 130 52 115 Z",
  rightArm: "M188 115 Q202 120 210 140 L218 180 Q222 210 218 240 L212 270 Q208 285 200 280 L192 250 Q188 220 190 190 L188 150 Q186 130 188 115 Z",
  leftLeg: "M50 290 L45 350 Q40 400 50 460 L55 475 Q70 480 90 475 L95 460 Q100 400 95 350 L90 290 Z",
  rightLeg: "M150 290 L155 350 Q160 400 150 460 L145 475 Q170 480 185 475 L190 460 Q200 400 195 350 L190 290 Z",

  // 각 근육 부위 경로
  muscles: {
    // 상체
    shoulder: [
      { d: "M30 130 Q25 150 20 170 Q35 180 50 160 Q55 140 50 120 Q40 120 30 130 Z", side: 'left' },
      { d: "M210 130 Q215 150 220 170 Q205 180 190 160 Q185 140 190 120 Q200 120 210 130 Z", side: 'right' }
    ],
    chest: [
      { d: "M60 105 Q55 130 60 155 Q80 165 118 165 L118 100 Q90 100 60 105 Z", side: 'left' },
      { d: "M180 105 Q185 130 180 155 Q160 165 122 165 L122 100 Q150 100 180 105 Z", side: 'right' }
    ],
    bicep: [
      { d: "M20 170 Q15 200 25 220 L45 210 Q40 190 50 160 Z", side: 'left' },
      { d: "M220 170 Q225 200 215 220 L195 210 Q200 190 190 160 Z", side: 'right' }
    ],
    tricep: [
      { d: "M18 170 L15 200 L25 220 L28 215 Z", side: 'left' },
      { d: "M222 170 L225 200 L215 220 L212 215 Z", side: 'right' }
    ],
    back: [
      { d: "M50 160 L55 210 L65 230 L75 200 L60 155 Z", side: 'left' },
      { d: "M190 160 L185 210 L175 230 L165 200 L180 155 Z", side: 'right' }
    ],

    // 코어
    abs: [
      { d: "M100 170 L95 190 L118 190 L118 170 Z", side: 'left_upper' },
      { d: "M140 170 L145 190 L122 190 L122 170 Z", side: 'right_upper' },
      { d: "M95 195 L92 220 L118 220 L118 195 Z", side: 'left_mid' },
      { d: "M145 195 L148 220 L122 220 L122 195 Z", side: 'right_mid' },
      { d: "M92 225 L95 250 L118 250 L118 225 Z", side: 'left_lower' },
      { d: "M148 225 L145 250 L122 250 L122 225 Z", side: 'right_lower' }
    ],
    obliques: [
      { d: "M65 230 L70 260 L90 260 L92 225 L75 200 Z", side: 'left' },
      { d: "M175 230 L170 260 L150 260 L148 225 L165 200 Z", side: 'right' }
    ],
    lowerback: [
      { d: "M75 200 L80 230 L90 260 L95 250 L92 225 L88 200 Z", side: 'left' },
      { d: "M165 200 L160 230 L150 260 L145 250 L148 225 L152 200 Z", side: 'right' }
    ],

    // 하체
    quadriceps: [
      { d: "M55 290 Q40 350 55 400 L85 390 Q95 350 90 300 Z", side: 'left' },
      { d: "M185 290 Q200 350 185 400 L155 390 Q145 350 150 300 Z", side: 'right' }
    ],
    hamstring: [
      { d: "M90 300 L85 350 L75 390 L55 400 L60 350 L70 300 Z", side: 'left' },
      { d: "M150 300 L155 350 L165 390 L185 400 L180 350 L170 300 Z", side: 'right' }
    ],
    calves: [
      { d: "M55 405 Q45 430 55 460 L85 450 Q80 420 85 400 Z", side: 'left' },
      { d: "M185 405 Q195 430 185 460 L155 450 Q160 420 155 400 Z", side: 'right' }
    ],
    glutes: [
      { d: "M70 285 Q60 295 65 315 L80 320 Q95 315 90 300 L80 285 Z", side: 'left' },
      { d: "M170 285 Q180 295 175 315 L160 320 Q145 315 150 300 L160 285 Z", side: 'right' }
    ]
  }
};

// SVG 인체 다이어그램 컴포넌트 - 해부학적 스타일
function BodyDiagram({
  muscleData,
  onMuscleClick,
  getWeeklyCount
}: {
  muscleData: MuscleGroup[];
  onMuscleClick: (id: string) => void;
  getWeeklyCount: (id: string) => number;
}) {
  // 부위별 그룹 정의
  const upperBodyMuscles = ['shoulder', 'chest', 'back'];
  const armMuscles = ['bicep', 'tricep'];
  const coreMuscles = ['abs', 'obliques', 'lowerback'];
  const lowerBodyMuscles = ['quadriceps', 'hamstring', 'calves', 'glutes'];

  // 부위별 선택 색상 반환
  const getSelectedColor = (muscleId: string) => {
    if (upperBodyMuscles.includes(muscleId)) return '#3b82f6'; // Blue - 상체
    if (armMuscles.includes(muscleId)) return '#8b5cf6'; // Violet - 팔
    if (coreMuscles.includes(muscleId)) return '#f97316'; // Orange - 코어
    if (lowerBodyMuscles.includes(muscleId)) return '#10b981'; // Emerald - 하체
    return '#3b82f6'; // 기본값
  };

  // 색상 정책: 부위별 다른 색상 적용
  const getColor = (muscleId: string, count: number, isSelected: boolean) => {
    if (isSelected) return getSelectedColor(muscleId);
    if (count >= 3) return '#22c55e'; // Green-500 (3회 이상)
    if (count >= 2) return '#f59e0b'; // Amber-500 (2회)
    if (count >= 1) return '#ef4444'; // Red-500 (1회)
    return '#334155'; // Slate-700 (미시작)
  };

  // 글로우 효과 개선 (네온 스타일)
  const getFilter = (count: number) => {
    if (count >= 3) return 'url(#neon-glow-green)';
    if (count >= 2) return 'url(#neon-glow-amber)';
    if (count >= 1) return 'url(#neon-glow-red)';
    return 'none';
  };

  const renderMuscleGroup = (id: string, paths: { d: string }[]) => {
    const count = getWeeklyCount(id);
    const color = getColor(id, count, false);

    return (
      <g
        key={id}
        onClick={() => onMuscleClick(id)}
        className="cursor-pointer transition-all duration-300"
        style={{ filter: getFilter(count) }}
      >
        {paths.map((path, idx) => (
          <motion.path
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            d={path.d}
            fill={color}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
            className="hover:opacity-80 transition-opacity"
            whileTap={{ scale: 0.98, transformOrigin: "center" }}
          />
        ))}
      </g>
    );
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <svg viewBox="0 0 240 480" className="w-full h-auto drop-shadow-2xl">
        <defs>
          {/* 네온 글로우 효과 정의 */}
          <filter id="neon-glow-selected" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="out" result="glow" />
            <feFlood floodColor="#60a5fa" floodOpacity="0.8" result="color" />
            <feComposite in="color" in2="glow" operator="in" result="coloredGlow" />
            <feMerge>
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#f59e0b" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#ef4444" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="torsoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* 1. 바디 실루엣 (배경) */}
        <path d={anatomyPaths.head} fill="url(#headGradient)" stroke="#334155" strokeWidth="1" />
        <path d={anatomyPaths.neck} fill="url(#headGradient)" stroke="#334155" strokeWidth="1" />
        <path d={anatomyPaths.torso} fill="url(#torsoGradient)" stroke="#334155" strokeWidth="1" />
        <path d={anatomyPaths.leftArm} fill="url(#torsoGradient)" stroke="#334155" strokeWidth="1" />
        <path d={anatomyPaths.rightArm} fill="url(#torsoGradient)" stroke="#334155" strokeWidth="1" />
        <path d={anatomyPaths.leftLeg} fill="url(#torsoGradient)" stroke="#334155" strokeWidth="1" />
        <path d={anatomyPaths.rightLeg} fill="url(#torsoGradient)" stroke="#334155" strokeWidth="1" />

        {/* 2. 각 근육 그룹 렌더링 */}
        {/* 상체 */}
        {renderMuscleGroup('shoulder', anatomyPaths.muscles.shoulder)}
        {renderMuscleGroup('chest', anatomyPaths.muscles.chest)}
        {renderMuscleGroup('bicep', anatomyPaths.muscles.bicep)}
        {renderMuscleGroup('tricep', anatomyPaths.muscles.tricep)}
        {renderMuscleGroup('back', anatomyPaths.muscles.back)}

        {/* 코어 */}
        {renderMuscleGroup('abs', anatomyPaths.muscles.abs)}
        {renderMuscleGroup('obliques', anatomyPaths.muscles.obliques)}
        {renderMuscleGroup('lowerback', anatomyPaths.muscles.lowerback)}

        {/* 하체 */}
        {renderMuscleGroup('quadriceps', anatomyPaths.muscles.quadriceps)}
        {renderMuscleGroup('hamstring', anatomyPaths.muscles.hamstring)}
        {renderMuscleGroup('calves', anatomyPaths.muscles.calves)}
        {renderMuscleGroup('glutes', anatomyPaths.muscles.glutes)}
      </svg>

      {/* 컬러 범례 - 네온 도트 스타일 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 w-full">
        <div className="flex items-center gap-1.5 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
          <span className="text-[10px] text-slate-400 font-medium">3회+</span>
        </div>
        <div className="flex items-center gap-1.5 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
          <span className="text-[10px] text-slate-400 font-medium">2회</span>
        </div>
        <div className="flex items-center gap-1.5 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
          <span className="text-[10px] text-slate-400 font-medium">1회</span>
        </div>
        <div className="flex items-center gap-1.5 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#64748b] opacity-60" />
          <span className="text-[10px] text-slate-400 font-medium">미시작</span>
        </div>
      </div>
    </div>
  );
}

export function WorkoutGuide({ user }: WorkoutGuideProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [routineSubTab, setRoutineSubTab] = useState('planner'); // 'planner', 'upper', 'lower'
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [logExercise, setLogExercise] = useState<{ muscleId: string; name: string } | null>(null);

  // 러닝 기록 타입 (거리, 시간, 페이스 포함)
  interface RunningRecord {
    id: string;
    date: string;
    imageUrl: string;
    distance: number; // km
    duration: string; // "mm:ss" 형식
    pace: string; // "m'ss\"/km" 형식
  }

  // 러닝 기록 상태
  const [runningRecords, setRunningRecords] = useState<RunningRecord[]>(() => {
    if (user && user.email) {
      try {
        const stored = localStorage.getItem(`running_records_v2_${user.email}`);
        return stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error('Failed to parse running records:', err);
        return [];
      }
    }
    return [];
  });

  // 러닝 업로드 다이얼로그 상태
  const [showRunningUploadDialog, setShowRunningUploadDialog] = useState(false);
  const [pendingRunningImage, setPendingRunningImage] = useState<string | null>(null);
  const [runningDate, setRunningDate] = useState(new Date().toISOString().split('T')[0]);
  const [runningDistance, setRunningDistance] = useState('');
  const [runningDuration, setRunningDuration] = useState('');
  const [runningPace, setRunningPace] = useState('');

  const saveRunningRecords = (records: RunningRecord[]) => {
    setRunningRecords(records);
    if (user) {
      localStorage.setItem(`running_records_v2_${user.email}`, JSON.stringify(records));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingRunningImage(reader.result as string);
      setRunningDate(new Date().toISOString().split('T')[0]);
      setRunningDistance('');
      setRunningDuration('');
      setRunningPace('');
      setShowRunningUploadDialog(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleConfirmRunningUpload = () => {
    if (!pendingRunningImage || !runningDistance) return;
    const newRecord: RunningRecord = {
      id: Date.now().toString(),
      date: new Date(runningDate).toISOString(),
      imageUrl: pendingRunningImage,
      distance: parseFloat(runningDistance) || 0,
      duration: runningDuration || '00:00',
      pace: runningPace || '-',
    };
    saveRunningRecords([newRecord, ...runningRecords]); // 최신 기록이 위로
    setPendingRunningImage(null);
    setShowRunningUploadDialog(false);
  };

  const handleDeleteRunningRecord = (id: string) => {
    saveRunningRecords(runningRecords.filter(r => r.id !== id));
  };

  // 이미지 상세보기 상태
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.email) {
      try {
        const stored = localStorage.getItem(`workout_logs_${user.email}`);
        if (stored) {
          const parsedLogs = JSON.parse(stored);
          if (Array.isArray(parsedLogs)) {
            setWorkoutLogs(parsedLogs);
          }
        }
      } catch (err) {
        console.error('Failed to parse workout logs:', err);
      }
    }
  }, [user]);

  const saveWorkoutLogs = (logs: WorkoutLog[]) => {
    setWorkoutLogs(logs);
    if (user) {
      localStorage.setItem(`workout_logs_${user.email}`, JSON.stringify(logs));
    }
  };

  // 이번 주 시작일 계산
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // 이번 주 특정 근육 운동 횟수
  const getWeeklyCount = (muscleId: string) => {
    const weekStart = getWeekStart();
    return workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return log.muscleId === muscleId && logDate >= weekStart;
    }).length;
  };

  // 이번 주 특정 근육의 운동 기록
  const getWeeklyLogs = (muscleId: string) => {
    const weekStart = getWeekStart();
    return workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return log.muscleId === muscleId && logDate >= weekStart;
    });
  };

  // 운동 기록 추가
  const handleLogExercise = (muscleId: string, exerciseName: string, sets: number, reps: number) => {
    if (!user) {
      alert('로그인이 필요합니다!');
      return;
    }

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      muscleId,
      exerciseName,
      sets,
      reps,
    };

    saveWorkoutLogs([...workoutLogs, newLog]);
    setShowLogDialog(false);
    setLogExercise(null);
  };

  // 운동 기록 삭제
  const handleDeleteLog = (logId: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      saveWorkoutLogs(workoutLogs.filter(log => log.id !== logId));
    }
  };

  const allMuscles: MuscleGroup[] = [
    ...muscleGroups.upper,
    ...muscleGroups.lower,
    ...muscleGroups.core,
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return difficulty;
    }
  };

  const handleMuscleNavigation = (muscleId: string) => {
    const isUpper = muscleGroups.upper.some(m => m.id === muscleId);
    const isLower = muscleGroups.lower.some(m => m.id === muscleId);

    setSelectedTab('routine');
    if (isUpper) {
      setRoutineSubTab('upper');
    } else if (isLower) {
      setRoutineSubTab('lower');
    } else {
      setRoutineSubTab('planner');
    }

    // 해당 부위로 스크롤 이동을 위한 지연 실행
    setTimeout(() => {
      setExpandedExercise(muscleId);
      const element = document.getElementById(`exercise-${muscleId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">이번 주 운동 기록</h1>
            <p className="text-muted-foreground text-sm">부위별 리커버리 및 성장을 체크하세요</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">전체</TabsTrigger>
          <TabsTrigger value="routine">루틴</TabsTrigger>
          <TabsTrigger value="running">러닝</TabsTrigger>
          <TabsTrigger value="diet">식단</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-2">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6">
            {/* Body Diagram Card */}
            <Card className="p-6 bg-[#1e293b]/50 border-white/5 backdrop-blur-sm shadow-2xl flex flex-col items-center">
              <h3 className="text-sm font-semibold mb-8 text-slate-300 uppercase tracking-widest">이번 주 운동 현황</h3>
              <BodyDiagram
                muscleData={allMuscles}
                onMuscleClick={handleMuscleNavigation}
                getWeeklyCount={getWeeklyCount}
              />
            </Card>

            {/* Weekly Stats List Card */}
            <div className="space-y-4">
              <Card className="p-6 bg-[#1e293b]/50 border-white/5 backdrop-blur-sm shadow-2xl h-full">
                <h3 className="text-base font-semibold mb-6 flex items-center gap-2 text-slate-200">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  이번 주 부위별 운동 횟수
                </h3>
                <div className="space-y-0.5">
                  {allMuscles.map(muscle => {
                    const count = getWeeklyCount(muscle.id);
                    const colorClass = count >= 3 ? 'text-emerald-400' : count >= 2 ? 'text-amber-400' : count >= 1 ? 'text-rose-400' : 'text-slate-500';

                    return (
                      <div
                        key={muscle.id}
                        className="group flex items-center justify-between py-3 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/5 border border-transparent"
                        onClick={() => handleMuscleNavigation(muscle.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${count >= 3 ? 'bg-emerald-400' : count >= 2 ? 'bg-amber-400' : count >= 1 ? 'bg-rose-400' : 'bg-slate-700'}`} />
                          <span className="text-sm font-medium transition-colors text-slate-300 group-hover:text-white">
                            {muscle.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${colorClass}`}>
                            {count}회
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Routine Tab */}
        <TabsContent value="routine" className="space-y-6">
          {/* Routine Sub-tabs */}
          <div className="flex bg-muted/50 p-1 rounded-xl border border-white/5 w-fit mx-auto sm:mx-0">
            <button
              onClick={() => setRoutineSubTab('planner')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${routineSubTab === 'planner' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-foreground'}`}
            >
              루틴 플래너
            </button>
            <button
              onClick={() => setRoutineSubTab('upper')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${routineSubTab === 'upper' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-foreground'}`}
            >
              상체 운동
            </button>
            <button
              onClick={() => setRoutineSubTab('lower')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${routineSubTab === 'lower' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-foreground'}`}
            >
              하체 운동
            </button>
          </div>

          <motion.div
            key={routineSubTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {routineSubTab === 'planner' && <RoutinePlanner user={user} />}

            {routineSubTab === 'upper' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 bg-blue-500 rounded-full" />
                  <h3 className="font-semibold text-lg">상체 운동 가이드</h3>
                </div>
                {muscleGroups.upper.map(muscle => (
                  <Card key={muscle.id} className="overflow-hidden bg-card/50 border-white/10 hover:border-primary/30 transition-colors shadow-sm">
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedExercise(expandedExercise === muscle.id ? null : muscle.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Target className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{muscle.name}</h3>
                            <p className="text-sm text-muted-foreground">{muscle.exercises.length}개 운동</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-white/10 bg-white/5">{getWeeklyCount(muscle.id)}회 / 주</Badge>
                          <ChevronRight className={`w-5 h-5 transition-transform text-muted-foreground ${expandedExercise === muscle.id ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {expandedExercise === muscle.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/5 bg-background/30">
                        <div className="p-4 space-y-3">
                          {muscle.exercises.map((exercise, idx) => (
                            <div key={idx} className="p-4 bg-background/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{exercise.name}</span>
                                  <Badge className={`${getDifficultyColor(exercise.difficulty)} border-none text-[10px]`}>
                                    {getDifficultyLabel(exercise.difficulty)}
                                  </Badge>
                                </div>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exercise.duration}</span>
                                  <span>{exercise.sets}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                                onClick={() => {
                                  setLogExercise({ muscleId: muscle.id, name: exercise.name });
                                  setShowLogDialog(true);
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" /> 기록
                              </Button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {routineSubTab === 'lower' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                    <h3 className="font-semibold text-lg">하체 운동 가이드</h3>
                  </div>
                  {muscleGroups.lower.map(muscle => (
                    <Card key={muscle.id} className="overflow-hidden bg-card/50 border-white/10 hover:border-primary/30 transition-colors shadow-sm">
                      <div
                        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedExercise(expandedExercise === muscle.id ? null : muscle.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                              <Target className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{muscle.name}</h3>
                              <p className="text-sm text-muted-foreground">{muscle.exercises.length}개 운동</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-white/10 bg-white/5">{getWeeklyCount(muscle.id)}회 / 주</Badge>
                            <ChevronRight className={`w-5 h-5 transition-transform text-muted-foreground ${expandedExercise === muscle.id ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                      </div>

                      {expandedExercise === muscle.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/5 bg-background/30">
                          <div className="p-4 space-y-3">
                            {muscle.exercises.map((exercise, idx) => (
                              <div key={idx} className="p-4 bg-background/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">{exercise.name}</span>
                                    <Badge className={`${getDifficultyColor(exercise.difficulty)} border-none text-[10px]`}>
                                      {getDifficultyLabel(exercise.difficulty)}
                                    </Badge>
                                  </div>
                                  <div className="flex gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exercise.duration}</span>
                                    <span>{exercise.sets}</span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                                  onClick={() => {
                                    setLogExercise({ muscleId: muscle.id, name: exercise.name });
                                    setShowLogDialog(true);
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-1" /> 기록
                                </Button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-orange-500 rounded-full" />
                    <h3 className="font-semibold text-lg">코어 운동 가이드</h3>
                  </div>
                  {muscleGroups.core.map(muscle => (
                    <Card key={muscle.id} className="overflow-hidden bg-card/50 border-white/10 hover:border-primary/30 transition-colors shadow-sm">
                      <div
                        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedExercise(expandedExercise === muscle.id ? null : muscle.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                              <Target className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{muscle.name}</h3>
                              <p className="text-sm text-muted-foreground">{muscle.exercises.length}개 운동</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-white/10 bg-white/5">{getWeeklyCount(muscle.id)}회 / 주</Badge>
                            <ChevronRight className={`w-5 h-5 transition-transform text-muted-foreground ${expandedExercise === muscle.id ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                      </div>

                      {expandedExercise === muscle.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/5 bg-background/30">
                          <div className="p-4 space-y-3">
                            {muscle.exercises.map((exercise, idx) => (
                              <div key={idx} className="p-4 bg-background/50 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">{exercise.name}</span>
                                    <Badge className={`${getDifficultyColor(exercise.difficulty)} border-none text-[10px]`}>
                                      {getDifficultyLabel(exercise.difficulty)}
                                    </Badge>
                                  </div>
                                  <div className="flex gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exercise.duration}</span>
                                    <span>{exercise.sets}</span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                                  onClick={() => {
                                    setLogExercise({ muscleId: muscle.id, name: exercise.name });
                                    setShowLogDialog(true);
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-1" /> 기록
                                </Button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* Diet Tab */}
        <TabsContent value="diet" className="space-y-4">
          <Diet user={user as any} />
        </TabsContent>

        {/* Running Tab */}
        < TabsContent value="running" className="space-y-4" >
          {/* 헤더 및 업로드 버튼 */}
          < Card className="p-4 bg-card/50 border-white/10" >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Footprints className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">러닝 기록</h2>
                  <p className="text-xs text-muted-foreground">총 {runningRecords.length}회</p>
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  기록 추가
                </div>
              </label>
            </div>
          </Card >

          {/* 총 통계 */}
          {
            runningRecords.length > 0 && (
              <Card className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">
                      {runningRecords.reduce((sum, r) => sum + (r.distance || 0), 0).toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">총 거리 (km)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{runningRecords.length}</p>
                    <p className="text-xs text-muted-foreground">총 러닝 횟수</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-400">
                      {(runningRecords.reduce((sum, r) => sum + (r.distance || 0), 0) / runningRecords.length || 0).toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">평균 거리 (km)</p>
                  </div>
                </div>
              </Card>
            )
          }

          {/* 러닝 기록 리스트 */}
          {
            runningRecords.length === 0 ? (
              <Card className="p-8 bg-card/50 border-white/10 text-center">
                <Footprints className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground mb-2">아직 러닝 기록이 없습니다</p>
                <p className="text-sm text-muted-foreground">위의 "기록 추가" 버튼을 눌러 시작하세요</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {runningRecords.map((record) => (
                  <Card key={record.id} className="p-4 bg-card/50 border-white/10">
                    <div className="flex gap-4">
                      {/* 썸네일 이미지 */}
                      <img
                        src={record.imageUrl}
                        alt="러닝 기록"
                        onClick={() => setViewingImage(record.imageUrl)}
                        className="w-20 h-20 object-cover rounded-lg border border-white/10 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      {/* 기록 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <button
                            onClick={() => handleDeleteRunningRecord(record.id)}
                            className="text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-3xl font-bold text-foreground">
                          {record.distance?.toFixed(2) || '0.00'}
                          <span className="text-lg font-normal text-muted-foreground ml-1">km</span>
                        </p>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {record.duration || '--:--'}
                          </span>
                          <span>{record.pace || '-'}/km</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          }
        </TabsContent >
      </Tabs >

      {/* Log Exercise Dialog */}
      < Dialog open={showLogDialog} onOpenChange={setShowLogDialog} >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>운동 기록</DialogTitle>
          </DialogHeader>
          {logExercise && (
            <div className="space-y-4">
              <p className="font-medium">{logExercise.name}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">세트 수</label>
                  <input
                    type="number"
                    defaultValue={3}
                    min={1}
                    id="sets-input"
                    className="w-full p-2 border rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">반복 횟수</label>
                  <input
                    type="number"
                    defaultValue={12}
                    min={1}
                    id="reps-input"
                    className="w-full p-2 border rounded-md mt-1"
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  const sets = parseInt((document.getElementById('sets-input') as HTMLInputElement).value) || 3;
                  const reps = parseInt((document.getElementById('reps-input') as HTMLInputElement).value) || 12;
                  handleLogExercise(logExercise.muscleId, logExercise.name, sets, reps);
                }}
              >
                기록 저장
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog >

      {/* Running Upload Dialog */}
      < Dialog open={showRunningUploadDialog} onOpenChange={setShowRunningUploadDialog} >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>러닝 기록 업로드</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {pendingRunningImage && (
              <img
                src={pendingRunningImage}
                alt="미리보기"
                className="w-full max-h-64 object-contain rounded-lg border border-white/10"
              />
            )}
            <div>
              <label className="text-sm text-muted-foreground">러닝 날짜</label>
              <input
                type="date"
                value={runningDate}
                onChange={(e) => setRunningDate(e.target.value)}
                className="w-full p-2 border rounded-md mt-1 bg-card border-white/20 text-foreground"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">거리 (km)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={runningDistance}
                  onChange={(e) => setRunningDistance(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1 bg-card border-white/20 text-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">시간</label>
                <input
                  type="text"
                  placeholder="mm:ss"
                  value={runningDuration}
                  onChange={(e) => setRunningDuration(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1 bg-card border-white/20 text-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">페이스</label>
                <input
                  type="text"
                  placeholder={"m'ss\""}
                  value={runningPace}
                  onChange={(e) => setRunningPace(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1 bg-card border-white/20 text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRunningUploadDialog(false);
                  setPendingRunningImage(null);
                }}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmRunningUpload}
                disabled={!runningDistance}
              >
                업로드
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog >

      {/* Image Viewer Dialog */}
      < Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="sm:max-w-3xl p-2 bg-black/90">
          {viewingImage && (
            <img
              src={viewingImage}
              alt="러닝 기록 상세"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog >
    </div >
  );
}