import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, TrendingUp, Target, Clock, ChevronRight, Plus, Check, Calendar, X } from 'lucide-react';
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

// SVG 인체 다이어그램 컴포넌트
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
    if (count >= 2) return '#f59e0b'; // 2회: amber  
    if (count >= 1) return '#ef4444'; // 1회: red
    return '#cbd5e1'; // 미시작: gray
  };

  const MuscleZone = ({ id, d }: { id: string; d: string }) => (
    <path
      d={d}
      fill={getColor(getWeeklyCount(id), selectedMuscle === id)}
      className="cursor-pointer transition-all duration-200 hover:brightness-110"
      style={{ filter: selectedMuscle === id ? 'drop-shadow(0 0 8px rgba(47, 128, 255, 0.5))' : undefined }}
      onClick={() => onMuscleClick(id)}
    />
  );

  return (
    <svg viewBox="0 0 200 420" className="w-full max-w-[280px] mx-auto drop-shadow-lg">
      <defs>
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Body silhouette */}
      <g>
        <ellipse cx="100" cy="38" rx="26" ry="30" fill="url(#skinGradient)" />
        <path d="M88 65 Q88 58 92 55 L108 55 Q112 58 112 65 L112 78 L88 78 Z" fill="url(#skinGradient)" />
        <path d="M52 82 Q48 85 46 95 L44 105 Q42 115 44 130 L46 175 Q48 195 55 205 L60 210 L65 215 L80 220 L100 222 L120 220 L135 215 L140 210 L145 205 Q152 195 154 175 L156 130 Q158 115 156 105 L154 95 Q152 85 148 82 Z" fill="url(#skinGradient)" />
        <path d="M44 95 Q30 100 25 110 L18 140 Q15 155 18 170 L22 200 Q24 210 30 215 L35 210 Q38 200 36 185 L34 155 Q32 140 35 125 L40 105 Z" fill="url(#skinGradient)" />
        <path d="M156 95 Q170 100 175 110 L182 140 Q185 155 182 170 L178 200 Q176 210 170 215 L165 210 Q162 200 164 185 L166 155 Q168 140 165 125 L160 105 Z" fill="url(#skinGradient)" />
        <path d="M65 218 L60 260 Q58 290 60 320 L62 360 Q64 380 70 395 L80 400 Q85 398 88 390 L92 360 Q95 330 93 290 L90 250 L85 220 Z" fill="url(#skinGradient)" />
        <path d="M135 218 L140 260 Q142 290 140 320 L138 360 Q136 380 130 395 L120 400 Q115 398 112 390 L108 360 Q105 330 107 290 L110 250 L115 220 Z" fill="url(#skinGradient)" />
      </g>

      {/* Muscle Groups */}
      <MuscleZone id="shoulder" d="M46 88 Q38 92 35 102 L34 115 Q34 120 38 118 L50 108 Q55 100 52 92 Z" />
      <MuscleZone id="shoulder" d="M154 88 Q162 92 165 102 L166 115 Q166 120 162 118 L150 108 Q145 100 148 92 Z" />
      <MuscleZone id="chest" d="M55 95 Q52 105 54 120 L58 135 Q70 145 85 148 L100 150 L100 95 Q80 90 55 95 Z" />
      <MuscleZone id="chest" d="M145 95 Q148 105 146 120 L142 135 Q130 145 115 148 L100 150 L100 95 Q120 90 145 95 Z" />
      <MuscleZone id="back" d="M48 115 Q45 130 46 150 L48 175 Q50 185 55 180 L58 160 Q60 135 55 115 Z" />
      <MuscleZone id="back" d="M152 115 Q155 130 154 150 L152 175 Q150 185 145 180 L142 160 Q140 135 145 115 Z" />
      <MuscleZone id="bicep" d="M35 115 Q28 118 26 130 L25 148 Q25 158 30 155 L38 145 Q42 130 40 118 Z" />
      <MuscleZone id="bicep" d="M165 115 Q172 118 174 130 L175 148 Q175 158 170 155 L162 145 Q158 130 160 118 Z" />
      <MuscleZone id="tricep" d="M40 120 Q45 125 45 140 L44 155 Q42 165 38 160 L35 145 Q32 130 36 120 Z" />
      <MuscleZone id="tricep" d="M160 120 Q155 125 155 140 L156 155 Q158 165 162 160 L165 145 Q168 130 164 120 Z" />
      <MuscleZone id="abs" d="M80 152 Q75 155 75 165 L76 175 Q78 185 82 188 L100 190 L118 188 Q122 185 124 175 L125 165 Q125 155 120 152 L100 150 Z" />
      <MuscleZone id="abs" d="M78 190 Q76 195 77 205 L80 215 Q85 220 100 222 Q115 220 120 215 L123 205 Q124 195 122 190 L100 192 Z" />
      <path d="M55 150 Q50 160 50 175 L52 195 Q55 205 60 210 L65 200 Q68 185 65 165 L60 150 Z" fill={getColor(getWeeklyCount('obliques'), selectedMuscle === 'obliques')} opacity="0.85" className="cursor-pointer transition-all duration-200 hover:brightness-110" onClick={() => onMuscleClick('obliques')} />
      <path d="M145 150 Q150 160 150 175 L148 195 Q145 205 140 210 L135 200 Q132 185 135 165 L140 150 Z" fill={getColor(getWeeklyCount('obliques'), selectedMuscle === 'obliques')} opacity="0.85" className="cursor-pointer transition-all duration-200 hover:brightness-110" onClick={() => onMuscleClick('obliques')} />
      <path d="M75 175 Q72 185 73 200 L78 215 L100 218 L122 215 L127 200 Q128 185 125 175 L100 172 Z" fill={getColor(getWeeklyCount('lowerback'), selectedMuscle === 'lowerback')} opacity="0.6" className="cursor-pointer transition-all duration-200 hover:brightness-110" onClick={() => onMuscleClick('lowerback')} />
      <MuscleZone id="glutes" d="M65 215 Q60 225 62 238 L70 250 Q80 255 90 252 L85 235 Q82 220 75 215 Z" />
      <MuscleZone id="glutes" d="M135 215 Q140 225 138 238 L130 250 Q120 255 110 252 L115 235 Q118 220 125 215 Z" />
      <MuscleZone id="quadriceps" d="M68 252 Q62 265 60 290 L62 320 Q65 335 72 340 L82 338 Q88 330 90 305 L92 275 Q92 260 88 250 Z" />
      <MuscleZone id="quadriceps" d="M132 252 Q138 265 140 290 L138 320 Q135 335 128 340 L118 338 Q112 330 110 305 L108 275 Q108 260 112 250 Z" />
      <path d="M72 255 Q78 270 80 295 L78 325 Q75 335 70 330 L65 305 Q62 280 68 255 Z" fill={getColor(getWeeklyCount('hamstring'), selectedMuscle === 'hamstring')} opacity="0.5" className="cursor-pointer transition-all duration-200 hover:brightness-110" onClick={() => onMuscleClick('hamstring')} />
      <path d="M128 255 Q122 270 120 295 L122 325 Q125 335 130 330 L135 305 Q138 280 132 255 Z" fill={getColor(getWeeklyCount('hamstring'), selectedMuscle === 'hamstring')} opacity="0.5" className="cursor-pointer transition-all duration-200 hover:brightness-110" onClick={() => onMuscleClick('hamstring')} />
      <MuscleZone id="calves" d="M64 345 Q60 355 62 375 L65 390 Q70 398 78 395 L82 380 Q85 365 82 350 L75 342 Z" />
      <MuscleZone id="calves" d="M136 345 Q140 355 138 375 L135 390 Q130 398 122 395 L118 380 Q115 365 118 350 L125 342 Z" />
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
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">전체 보기</TabsTrigger>
          <TabsTrigger value="upper">상체</TabsTrigger>
          <TabsTrigger value="lower">하체/코어</TabsTrigger>
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
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedMuscle === muscle.id ? 'bg-blue-50' : 'hover:bg-muted/50'}`}
                        onClick={() => setSelectedMuscle(muscle.id === selectedMuscle ? null : muscle.id)}
                      >
                        <span className="font-medium">{muscle.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${count >= 3 ? 'text-green-600' : count >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
                            {count}회
                          </span>
                          {count >= 3 && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Selected Muscle Detail */}
              {selectedMuscleData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-4 border-blue-200 bg-blue-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{selectedMuscleData.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedMuscleData.nameEn}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">{getWeeklyCount(selectedMuscleData.id)}회</span>
                        <p className="text-xs text-muted-foreground">이번 주</p>
                      </div>
                    </div>

                    {/* 이번 주 기록된 운동들 */}
                    {getWeeklyLogs(selectedMuscleData.id).length > 0 && (
                      <div className="mb-3 space-y-1">
                        <p className="text-sm font-medium">기록된 운동:</p>
                        {getWeeklyLogs(selectedMuscleData.id).map(log => (
                          <div key={log.id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                            <span>{log.exerciseName} ({log.sets}세트 x {log.reps}회)</span>
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-red-500 hover:text-red-700"
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
            <Card key={muscle.id} className="overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedExercise(expandedExercise === muscle.id ? null : muscle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600" />
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
    </div>
  );
}