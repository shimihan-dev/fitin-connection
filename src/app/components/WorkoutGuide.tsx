import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, TrendingUp, Target, Clock, ChevronRight, Plus, Check, Calendar, X, Footprints, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

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

// SVG 인체 다이어그램 컴포넌트 - 해부학적 스타일
function BodyDiagram({
  muscleData,
  selectedMuscle,
  onMuscleClick,
  getWeeklyCount
}: {
  muscleData: MuscleGroup[];
  selectedMuscle: string | null;
  onMuscleClick: (id: string) => void;
  getWeeklyCount: (id: string) => number;
}) {
  const getColor = (count: number, isSelected: boolean) => {
    if (isSelected) return '#2F80FF';
    if (count >= 3) return '#22c55e'; // 3회 이상: green
    if (count >= 2) return '#facc15'; // 2회: yellow  
    if (count >= 1) return '#ef4444'; // 1회: red
    return '#374151'; // 미시작: dark gray
  };

  const getGlow = (count: number, isSelected: boolean) => {
    if (isSelected) return 'drop-shadow(0 0 12px rgba(47, 128, 255, 0.8))';
    if (count >= 3) return 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))';
    if (count >= 2) return 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))';
    if (count >= 1) return 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))';
    return 'none';
  };

  const MuscleZone = ({ id, d, opacity = 1 }: { id: string; d: string; opacity?: number }) => (
    <path
      d={d}
      fill={getColor(getWeeklyCount(id), selectedMuscle === id)}
      opacity={opacity}
      stroke={getWeeklyCount(id) > 0 || selectedMuscle === id ? getColor(getWeeklyCount(id), selectedMuscle === id) : '#1f2937'}
      strokeWidth="1"
      className="cursor-pointer transition-all duration-300 hover:brightness-125"
      style={{ filter: getGlow(getWeeklyCount(id), selectedMuscle === id) }}
      onClick={() => onMuscleClick(id)}
    />
  );

  return (
    <svg viewBox="0 0 240 480" className="w-full max-w-[320px] mx-auto">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="bodyOutline" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="240" height="480" fill="url(#bgGradient)" rx="12" />

      <g stroke="#475569" strokeWidth="1.5" fill="none">
        <ellipse cx="120" cy="45" rx="28" ry="32" />
        <path d="M108 75 L108 90 L132 90 L132 75" />
        <path d="M70 95 Q55 100 50 115 L45 160 Q42 200 48 230 L55 245 Q70 260 90 265 L120 268 L150 265 Q170 260 185 245 L192 230 Q198 200 195 160 L190 115 Q185 100 170 95 Z" />
        <path d="M50 110 Q35 115 28 135 L18 180 Q12 210 18 240 L28 275" />
        <path d="M190 110 Q205 115 212 135 L222 180 Q228 210 222 240 L212 275" />
        <path d="M85 265 L78 320 Q72 370 75 420 L80 455" />
        <path d="M155 265 L162 320 Q168 370 165 420 L160 455" />
      </g>

      <MuscleZone id="shoulder" d="M50 100 Q38 105 32 120 L30 140 Q32 150 40 148 L55 135 Q62 120 58 105 Z" />
      <MuscleZone id="shoulder" d="M190 100 Q202 105 208 120 L210 140 Q208 150 200 148 L185 135 Q178 120 182 105 Z" />

      <MuscleZone id="chest" d="M68 100 Q60 115 62 135 L70 155 Q85 168 105 172 L120 174 L120 100 Q95 95 68 100 Z" />
      <MuscleZone id="chest" d="M172 100 Q180 115 178 135 L170 155 Q155 168 135 172 L120 174 L120 100 Q145 95 172 100 Z" />

      <MuscleZone id="back" d="M52 130 Q48 150 50 175 L55 205 Q60 220 68 215 L72 190 Q75 160 70 130 Z" opacity={0.8} />
      <MuscleZone id="back" d="M188 130 Q192 150 190 175 L185 205 Q180 220 172 215 L168 190 Q165 160 170 130 Z" opacity={0.8} />

      <MuscleZone id="bicep" d="M32 145 Q22 150 18 170 L15 195 Q15 210 22 208 L35 195 Q42 175 40 155 Z" />
      <MuscleZone id="bicep" d="M208 145 Q218 150 222 170 L225 195 Q225 210 218 208 L205 195 Q198 175 200 155 Z" />

      <MuscleZone id="tricep" d="M40 155 Q48 165 48 185 L45 210 Q42 225 35 218 L30 200 Q25 175 32 155 Z" />
      <MuscleZone id="tricep" d="M200 155 Q192 165 192 185 L195 210 Q198 225 205 218 L210 200 Q215 175 208 155 Z" />

      <MuscleZone id="abs" d="M100 175 L100 195 L120 195 L120 175 Q115 172 100 175 Z" />
      <MuscleZone id="abs" d="M120 175 L120 195 L140 195 L140 175 Q125 172 120 175 Z" />
      <MuscleZone id="abs" d="M98 198 L98 218 L120 218 L120 198 Z" />
      <MuscleZone id="abs" d="M120 198 L120 218 L142 218 L142 198 Z" />
      <MuscleZone id="abs" d="M96 222 L96 242 L120 242 L120 222 Z" />
      <MuscleZone id="abs" d="M120 222 L120 242 L144 242 L144 222 Z" />

      <MuscleZone id="lowerback" d="M68 175 Q62 190 62 210 L65 235 Q70 250 78 248 L82 225 Q85 200 80 175 Z" />
      <MuscleZone id="lowerback" d="M172 175 Q178 190 178 210 L175 235 Q170 250 162 248 L158 225 Q155 200 160 175 Z" />

      <MuscleZone id="quadriceps" d="M85 268 Q75 290 72 330 L75 380 Q80 400 92 405 L105 400 Q115 385 118 345 L120 300 Q118 275 110 265 Z" />
      <MuscleZone id="quadriceps" d="M155 268 Q165 290 168 330 L165 380 Q160 400 148 405 L135 400 Q125 385 122 345 L120 300 Q122 275 130 265 Z" />

      <MuscleZone id="hamstring" d="M90 285 Q98 310 100 350 L95 395 Q88 405 80 395 L75 355 Q72 315 82 285 Z" opacity={0.6} />
      <MuscleZone id="hamstring" d="M150 285 Q142 310 140 350 L145 395 Q152 405 160 395 L165 355 Q168 315 158 285 Z" opacity={0.6} />

      <MuscleZone id="glutes" d="M82 252 Q72 265 75 285 L85 300 Q100 308 112 302 L108 280 Q105 260 95 252 Z" />
      <MuscleZone id="glutes" d="M158 252 Q168 265 165 285 L155 300 Q140 308 128 302 L132 280 Q135 260 145 252 Z" />

      <MuscleZone id="calves" d="M75 410 Q68 425 72 450 L78 465 Q85 472 95 468 L100 450 Q105 430 100 412 L88 405 Z" />
      <MuscleZone id="calves" d="M165 410 Q172 425 168 450 L162 465 Q155 472 145 468 L140 450 Q135 430 140 412 L152 405 Z" />
    </svg>
  );
}

export function WorkoutGuide({ user }: WorkoutGuideProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
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
    if (user) {
      const stored = localStorage.getItem(`running_records_v2_${user.email}`);
      return stored ? JSON.parse(stored) : [];
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
    if (user) {
      const stored = localStorage.getItem(`workout_logs_${user.email}`);
      if (stored) setWorkoutLogs(JSON.parse(stored));
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

  const selectedMuscleData = allMuscles.find(m => m.id === selectedMuscle);

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

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">이번 주 운동 기록</h1>
            <p className="text-muted-foreground">부위별 운동 횟수를 기록해보세요</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">전체</TabsTrigger>
          <TabsTrigger value="upper">상체</TabsTrigger>
          <TabsTrigger value="lower">하체</TabsTrigger>
          <TabsTrigger value="running">러닝</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Body Diagram */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">이번 주 운동 현황</h3>
              <BodyDiagram
                muscleData={allMuscles}
                selectedMuscle={selectedMuscle}
                onMuscleClick={(id) => setSelectedMuscle(id === selectedMuscle ? null : id)}
                getWeeklyCount={getWeeklyCount}
              />
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  <span>3회+</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span>2회</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span>1회</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#cbd5e1]" />
                  <span>미시작</span>
                </div>
              </div>
            </Card>

            {/* Weekly Stats */}
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  이번 주 부위별 운동 횟수
                </h3>
                <div className="space-y-2">
                  {allMuscles.map(muscle => {
                    const count = getWeeklyCount(muscle.id);
                    return (
                      <div
                        key={muscle.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${selectedMuscle === muscle.id ? 'bg-primary/20 border border-primary/40 backdrop-blur-sm shadow-lg shadow-primary/10' : 'hover:bg-white/5 border border-transparent'}`}
                        onClick={() => setSelectedMuscle(muscle.id === selectedMuscle ? null : muscle.id)}
                      >
                        <span className="font-medium text-foreground">{muscle.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${count >= 3 ? 'text-emerald-400' : count >= 1 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                            {count}회
                          </span>
                          {count >= 3 && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Selected Muscle Detail */}
              {selectedMuscleData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-4 border-primary/30 bg-primary/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{selectedMuscleData.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedMuscleData.nameEn}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">{getWeeklyCount(selectedMuscleData.id)}회</span>
                        <p className="text-xs text-muted-foreground">이번 주</p>
                      </div>
                    </div>

                    {/* 이번 주 기록된 운동들 */}
                    {getWeeklyLogs(selectedMuscleData.id).length > 0 && (
                      <div className="mb-3 space-y-1">
                        <p className="text-sm font-medium">기록된 운동:</p>
                        {getWeeklyLogs(selectedMuscleData.id).map(log => (
                          <div key={log.id} className="flex items-center justify-between text-sm bg-background/50 p-2 rounded border border-white/10">
                            <span className="text-foreground">{log.exerciseName} ({log.sets}세트 x {log.reps}회)</span>
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedTab(muscleGroups.upper.some(m => m.id === selectedMuscleData.id) ? 'upper' : 'lower')}
                    >
                      운동 기록하기 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Upper Body Tab */}
        <TabsContent value="upper" className="space-y-4">
          {muscleGroups.upper.map(muscle => (
            <Card key={muscle.id} className="overflow-hidden bg-card/50 border-white/10">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedExercise(expandedExercise === muscle.id ? null : muscle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{muscle.name}</h3>
                      <p className="text-sm text-muted-foreground">{muscle.exercises.length}개 운동</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-white/20">{getWeeklyCount(muscle.id)}회/주</Badge>
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedExercise === muscle.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              {expandedExercise === muscle.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/10">
                  <div className="p-4 space-y-3">
                    {muscle.exercises.map((exercise, idx) => (
                      <div key={idx} className="p-3 bg-background/50 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{exercise.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {getDifficultyLabel(exercise.difficulty)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline" className="border-white/20"
                              onClick={() => {
                                setLogExercise({ muscleId: muscle.id, name: exercise.name });
                                setShowLogDialog(true);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exercise.duration}</span>
                          <span>{exercise.sets}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* Lower Body / Core Tab */}
        <TabsContent value="lower" className="space-y-4">
          <h3 className="font-semibold text-lg">하체</h3>
          {muscleGroups.lower.map(muscle => (
            <Card key={muscle.id} className="overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedExercise(expandedExercise === muscle.id ? null : muscle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{muscle.name}</h3>
                      <p className="text-sm text-muted-foreground">{muscle.exercises.length}개 운동</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{getWeeklyCount(muscle.id)}회/주</Badge>
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedExercise === muscle.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              {expandedExercise === muscle.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t">
                  <div className="p-4 space-y-3">
                    {muscle.exercises.map((exercise, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{exercise.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {getDifficultyLabel(exercise.difficulty)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setLogExercise({ muscleId: muscle.id, name: exercise.name });
                                setShowLogDialog(true);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exercise.duration}</span>
                          <span>{exercise.sets}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          ))}

          <h3 className="font-semibold text-lg pt-4">코어</h3>
          {muscleGroups.core.map(muscle => (
            <Card key={muscle.id} className="overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedExercise(expandedExercise === muscle.id ? null : muscle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{muscle.name}</h3>
                      <p className="text-sm text-muted-foreground">{muscle.exercises.length}개 운동</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{getWeeklyCount(muscle.id)}회/주</Badge>
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedExercise === muscle.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              {expandedExercise === muscle.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t">
                  <div className="p-4 space-y-3">
                    {muscle.exercises.map((exercise, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{exercise.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {getDifficultyLabel(exercise.difficulty)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setLogExercise({ muscleId: muscle.id, name: exercise.name });
                                setShowLogDialog(true);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exercise.duration}</span>
                          <span>{exercise.sets}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* Running Tab */}
        <TabsContent value="running" className="space-y-4">
          {/* 헤더 및 업로드 버튼 */}
          <Card className="p-4 bg-card/50 border-white/10">
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
          </Card>

          {/* 총 통계 */}
          {runningRecords.length > 0 && (
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
          )}

          {/* 러닝 기록 리스트 */}
          {runningRecords.length === 0 ? (
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
          )}
        </TabsContent>
      </Tabs>

      {/* Log Exercise Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
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
      </Dialog>

      {/* Running Upload Dialog */}
      <Dialog open={showRunningUploadDialog} onOpenChange={setShowRunningUploadDialog}>
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
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="sm:max-w-3xl p-2 bg-black/90">
          {viewingImage && (
            <img
              src={viewingImage}
              alt="러닝 기록 상세"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}