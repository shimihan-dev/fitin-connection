import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Plus, Trash2, CheckCircle, Circle, Save, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { supabase } from '../../../utils/supabase/client';

interface WorkoutRoutine {
  id: string;
  day: string;
  workouts: { text: string; completed: boolean }[];
  completed: boolean;
}

interface WorkoutRecord {
  date: Date;
  workouts: string[];
}

interface RoutinePlannerProps {
  user: { name: string; email: string; id?: string } | null;
}

const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  { id: '1', day: '월요일', workouts: [{ text: '상체 운동 30분', completed: false }, { text: '플랭크 3세트', completed: false }, { text: '스트레칭 10분', completed: false }], completed: false },
  { id: '2', day: '수요일', workouts: [{ text: '하체 운동 30분', completed: false }, { text: '스쿼트 3세트', completed: false }, { text: '요가 20분', completed: false }], completed: false },
  { id: '3', day: '금요일', workouts: [{ text: '유산소 20분', completed: false }, { text: '코어 운동 15분', completed: false }, { text: '전신 스트레칭', completed: false }], completed: false },
];

export function RoutinePlanner({ user }: RoutinePlannerProps) {
  // ── 루틴 상태 (localStorage에서 초기값 로드) ────────────────
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => {
    if (!user?.email) return DEFAULT_ROUTINES;
    try {
      const saved = localStorage.getItem(`routines_${user.email}`);
      return saved ? JSON.parse(saved) : DEFAULT_ROUTINES;
    } catch {
      return DEFAULT_ROUTINES;
    }
  });

  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([
    { date: new Date(2024, 11, 23), workouts: ['상체 운동 30분', '플랭크 3세트'] },
    { date: new Date(2024, 11, 25), workouts: ['하체 운동 30분', '스쿼트 3세트'] },
    { date: new Date(2024, 11, 27), workouts: ['유산소 20분', '코어 운동 15분'] },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dbLoading, setDbLoading] = useState(false);

  // ── localStorage 자동 저장 (routines 변경 시) ────────────────
  useEffect(() => {
    if (!user?.email) return;
    try {
      localStorage.setItem(`routines_${user.email}`, JSON.stringify(routines));
    } catch (e) {
      console.error('localStorage 저장 실패:', e);
    }
  }, [routines, user?.email]);

  // ── Supabase에서 루틴 로드 ────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    setDbLoading(true);
    supabase
      .from('routines')
      .select('exercises')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.exercises) {
          try {
            const loaded = JSON.parse(
              typeof data.exercises === 'string' ? data.exercises : JSON.stringify(data.exercises)
            );
            if (Array.isArray(loaded) && loaded.length > 0) {
              setRoutines(loaded);
            }
          } catch {
            // Supabase 데이터 파싱 실패 시 localStorage 값 유지
          }
        }
        setDbLoading(false);
      });
  }, [user?.id]);

  // ── Supabase 저장 ─────────────────────────────────────────────
  const saveToSupabase = async () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }
    setSaving(true);
    setSaveStatus('idle');
    try {
      const { error } = await supabase
        .from('routines')
        .upsert(
          {
            user_id:    user.id,
            name:       '내 루틴',
            exercises:  JSON.stringify(routines),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('루틴 저장 실패:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  // ── 루틴 조작 함수들 ──────────────────────────────────────────
  const toggleComplete = (id: string) => {
    setRoutines(routines.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const toggleWorkoutComplete = (routineId: string, workoutIndex: number) => {
    setRoutines(routines.map((routine) => {
      if (routine.id !== routineId) return routine;
      const updatedWorkouts = routine.workouts.map((w, idx) =>
        idx === workoutIndex ? { ...w, completed: !w.completed } : w
      );
      return { ...routine, workouts: updatedWorkouts, completed: updatedWorkouts.every((w) => w.completed) };
    }));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter((r) => r.id !== id));
  };

  interface Template {
    name: string;
    description: string;
    routines: { day: string; workouts: string[] }[];
  }

  const templates: Template[] = [
    { name: '초급자용 루틴', description: '기초 체력 향상과 자세 교정 (상세 루틴 업데이트 예정)', routines: [] },
    { name: '중급자용 루틴', description: '근육 근력 증가와 부위별 타겟팅 (상세 루틴 업데이트 예정)', routines: [] },
    { name: '상급자용 루틴', description: '고강도 훈련과 근비대 극대화 (상세 루틴 업데이트 예정)', routines: [] },
  ];

  const applyTemplate = (templateIndex: number) => {
    const template = templates[templateIndex];
    if (template.routines.length === 0) {
      alert('자세한 루틴 안내가 곧 추가될 예정입니다!');
      setShowTemplates(false);
      return;
    }
    setRoutines(
      template.routines.map((routine, index) => ({
        id: Date.now().toString() + index,
        day: routine.day,
        workouts: routine.workouts.map((w) => ({ text: w, completed: false })),
        completed: false,
      }))
    );
    setShowTemplates(false);
  };

  const weeklyProgress = routines.filter((r) => r.completed).length;
  const totalRoutines = routines.length;
  const progressPercentage = totalRoutines > 0 ? (weeklyProgress / totalRoutines) * 100 : 0;

  const getWorkoutForDate = (date: Date) => workoutRecords.find((r) => isSameDay(r.date, date));
  const hasWorkoutOnDate = (date: Date) => workoutRecords.some((r) => isSameDay(r.date, date));
  const selectedDateWorkout = selectedDate ? getWorkoutForDate(selectedDate) : undefined;

  // ── JSX ──────────────────────────────────────────────────────
  return (
    <div className="py-6 space-y-6">

      {/* 헤더 + 저장 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">루틴 플래너</h1>
          {dbLoading && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> 불러오는 중...
            </p>
          )}
        </div>

        {/* 저장 버튼 */}
        <Button
          onClick={saveToSupabase}
          disabled={saving || !user?.id}
          className={`flex items-center gap-2 transition-colors ${
            saveStatus === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
            saveStatus === 'error'   ? 'bg-red-600 hover:bg-red-700' :
            'bg-primary hover:bg-primary/90'
          }`}
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> 저장 중...</>
          ) : saveStatus === 'success' ? (
            <><CheckCircle className="w-4 h-4" /> 저장 완료!</>
          ) : saveStatus === 'error' ? (
            '저장 실패 — 재시도'
          ) : (
            <><Save className="w-4 h-4" /> 루틴 저장</>
          )}
        </Button>
      </div>

      {/* 주간 진행률 */}
      <Card className="p-4 bg-card/50 border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">이번 주 진행률</span>
          <span className="text-sm text-muted-foreground">{weeklyProgress}/{totalRoutines} 완료</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {progressPercentage === 100 ? '🎉 이번 주 루틴 완료!' : `${Math.round(progressPercentage)}% 달성`}
        </p>
      </Card>

      {/* 뷰 전환 버튼 */}
      <div className="flex gap-2">
        <Button
          variant={!showCalendarView ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCalendarView(false)}
          className="flex items-center gap-2"
        >
          루틴 목록
        </Button>
        <Button
          variant={showCalendarView ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCalendarView(true)}
          className="flex items-center gap-2"
        >
          <CalendarIcon className="w-4 h-4" />
          캘린더 보기
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 ml-auto"
        >
          <Plus className="w-4 h-4" />
          템플릿
        </Button>
      </div>

      {/* 캘린더 뷰 */}
      {showCalendarView && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 bg-card/50 border-border">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              modifiers={{ hasWorkout: (date) => hasWorkoutOnDate(date) }}
              modifiersClassNames={{ hasWorkout: 'bg-emerald-500/20 text-emerald-400 font-bold rounded-full' }}
              className="w-full"
            />
            {selectedDate && selectedDateWorkout && (
              <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <p className="text-sm font-medium text-emerald-400 mb-2">
                  {format(selectedDate, 'M월 d일', { locale: ko })} 운동 기록
                </p>
                {selectedDateWorkout.workouts.map((w, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {w}</p>
                ))}
              </div>
            )}
            {selectedDate && !selectedDateWorkout && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                {format(selectedDate, 'M월 d일', { locale: ko })}은 운동 기록이 없어요.
              </p>
            )}
          </Card>
        </motion.div>
      )}

      {/* 템플릿 */}
      {showTemplates && !showCalendarView && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
          {templates.map((template, index) => (
            <Card key={template.name} className="p-4 bg-card/50 border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <Button size="sm" onClick={() => applyTemplate(index)} className="bg-emerald-600 hover:bg-emerald-700">
                  적용
                </Button>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* 루틴 목록 */}
      {!showCalendarView && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">내 루틴</h2>

          {routines.length === 0 ? (
            <Card className="p-8 text-center bg-card/50 border-border">
              <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">아직 등록된 루틴이 없어요</p>
              <p className="text-sm text-muted-foreground/70">위에서 추천 루틴을 선택해보세요!</p>
            </Card>
          ) : (
            routines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`p-4 transition-all ${routine.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card/50 border-border hover:border-border'}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleComplete(routine.id)} className="flex-shrink-0 mt-1">
                      {routine.completed
                        ? <CheckCircle className="w-6 h-6 text-emerald-400" />
                        : <Circle className="w-6 h-6 text-muted-foreground" />
                      }
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-semibold ${routine.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {routine.day}
                        </h3>
                        {routine.completed && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">완료</Badge>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {routine.workouts.map((workout, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <button onClick={() => toggleWorkoutComplete(routine.id, idx)} className="flex-shrink-0 mt-0.5">
                              {workout.completed
                                ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                                : <Circle className="w-4 h-4 text-muted-foreground" />
                              }
                            </button>
                            <span className={`text-sm ${workout.completed ? 'line-through text-muted-foreground/50' : 'text-muted-foreground'}`}>
                              {workout.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      className="flex-shrink-0 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Tip */}
      {!showCalendarView && (
        <Card className="p-4 bg-primary/10 border-primary/30">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">💡 Tip:</strong> 루틴을 변경한 뒤 <strong className="text-foreground">루틴 저장</strong> 버튼을 눌러야 다음에도 유지됩니다.
          </p>
        </Card>
      )}
    </div>
  );
}