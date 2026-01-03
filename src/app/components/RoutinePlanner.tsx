import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

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
  user: { name: string; email: string } | null;
}

export function RoutinePlanner({ user }: RoutinePlannerProps) {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([
    {
      id: '1',
      day: '월요일',
      workouts: [
        { text: '상체 운동 30분', completed: false },
        { text: '플랭크 3세트', completed: false },
        { text: '스트레칭 10분', completed: false },
      ],
      completed: false,
    },
    {
      id: '2',
      day: '수요일',
      workouts: [
        { text: '하체 운동 30분', completed: false },
        { text: '스쿼트 3세트', completed: false },
        { text: '요가 20분', completed: false },
      ],
      completed: false,
    },
    {
      id: '3',
      day: '금요일',
      workouts: [
        { text: '유산소 20분', completed: false },
        { text: '코어 운동 15분', completed: false },
        { text: '전신 스트레칭', completed: false },
      ],
      completed: false,
    },
  ]);

  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([
    { date: new Date(2024, 11, 23), workouts: ['상체 운동 30분', '플랭크 3세트'] },
    { date: new Date(2024, 11, 25), workouts: ['하체 운동 30분', '스쿼트 3세트'] },
    { date: new Date(2024, 11, 27), workouts: ['유산소 20분', '코어 운동 15분'] },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);

  const templates = [
    {
      name: '초보자 3일 루틴',
      description: '주 3회, 각 30분',
      routines: [
        { day: '월요일', workouts: ['전신 운동 20분', '스트레칭 10분'] },
        { day: '수요일', workouts: ['유산소 20분', '코어 운동 10분'] },
        { day: '금요일', workouts: ['상체 15분', '하체 15분'] },
      ],
    },
    {
      name: '중급자 4일 루틴',
      description: '주 4회, 각 40분',
      routines: [
        { day: '월요일', workouts: ['상체 집중 30분', '복근 10분'] },
        { day: '화요일', workouts: ['하체 집중 30분', '스트레칭 10분'] },
        { day: '목요일', workouts: ['유산소 25분', '코어 15분'] },
        { day: '토요일', workouts: ['전신 운동 30분', '요가 10분'] },
      ],
    },
    {
      name: '바쁜 대학생용',
      description: '주 3회, 각 20분',
      routines: [
        { day: '월요일', workouts: ['HIIT 15분', '스트레칭 5분'] },
        { day: '수요일', workouts: ['상체+코어 20분'] },
        { day: '금요일', workouts: ['하체+유산소 20분'] },
      ],
    },
  ];

  const toggleComplete = (id: string) => {
    setRoutines(
      routines.map((routine) => {
        if (routine.id === id) {
          // 모든 운동이 완료되었는지 확인
          const allWorkoutsCompleted = routine.workouts.every((w) => w.completed);
          return { ...routine, completed: !routine.completed };
        }
        return routine;
      })
    );
  };

  const toggleWorkoutComplete = (routineId: string, workoutIndex: number) => {
    setRoutines(
      routines.map((routine) => {
        if (routine.id === routineId) {
          const updatedWorkouts = routine.workouts.map((workout, idx) =>
            idx === workoutIndex ? { ...workout, completed: !workout.completed } : workout
          );
          // 모든 운동이 완료되면 루틴도 완료 처리
          const allCompleted = updatedWorkouts.every((w) => w.completed);
          return { ...routine, workouts: updatedWorkouts, completed: allCompleted };
        }
        return routine;
      })
    );
  };

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  const applyTemplate = (templateIndex: number) => {
    const template = templates[templateIndex];
    const newRoutines = template.routines.map((routine, index) => ({
      id: Date.now().toString() + index,
      day: routine.day,
      workouts: routine.workouts.map((workout) => ({ text: workout, completed: false })),
      completed: false,
    }));
    setRoutines(newRoutines);
    setShowTemplates(false);
  };

  const weeklyProgress = routines.filter((r) => r.completed).length;
  const totalRoutines = routines.length;
  const progressPercentage = totalRoutines > 0 ? (weeklyProgress / totalRoutines) * 100 : 0;

  const getWorkoutForDate = (date: Date) => {
    return workoutRecords.find((record) => isSameDay(record.date, date));
  };

  const hasWorkoutOnDate = (date: Date) => {
    return workoutRecords.some((record) => isSameDay(record.date, date));
  };

  const selectedDateWorkout = selectedDate ? getWorkoutForDate(selectedDate) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">나의 운동 루틴</h1>
            <p className="text-sm text-gray-600">주간 운동 계획을 세워보세요</p>
          </div>
        </div>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">이번 주 진행률</span>
              <span className="text-sm">
                {weeklyProgress}/{totalRoutines} 완료
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-600 text-center">
              {progressPercentage === 100
                ? '🎉 이번 주 목표 달성! 대단해요!'
                : '꾸준히 운동하면 건강해져요!'}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* View Toggle Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowCalendarView(!showCalendarView)}
          variant={showCalendarView ? 'default' : 'outline'}
          className="flex-1"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {showCalendarView ? '루틴 보기' : '달력 보기'}
        </Button>
        <Button
          onClick={() => setShowTemplates(!showTemplates)}
          variant="outline"
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showTemplates ? '템플릿 닫기' : '추천 루틴'}
        </Button>
      </div>

      {/* Calendar View */}
      {showCalendarView && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              modifiers={{
                workout: (date) => hasWorkoutOnDate(date),
              }}
              modifiersStyles={{
                workout: {
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
              className="rounded-md border-0"
            />
          </Card>

          {/* Selected Date Details */}
          {selectedDate && (
            <Card className="p-5">
              <h3 className="mb-3">
                {format(selectedDate, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
              </h3>
              {selectedDateWorkout ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">운동 완료</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedDateWorkout.workouts.map((workout, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{workout}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Circle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">이 날은 운동 기록이 없어요</p>
                </div>
              )}
            </Card>
          )}

          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> 초록색으로 표시된 날짜는 운동을 완료한 날이에요!
            </p>
          </Card>
        </motion.div>
      )}

      {/* Templates */}
      {showTemplates && !showCalendarView && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          {templates.map((template, index) => (
            <Card key={template.name} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => applyTemplate(index)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  적용
                </Button>
              </div>
              <div className="space-y-1">
                {template.routines.map((routine, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {routine.day}
                    </Badge>
                    <span className="text-xs">{routine.workouts.join(', ')}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Routine List */}
      {!showCalendarView && (
        <div className="space-y-3">
          <h2 className="text-lg">내 루틴</h2>
          {routines.length === 0 ? (
            <Card className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">아직 등록된 루틴이 없어요</p>
              <p className="text-sm text-gray-500">위에서 추천 루틴을 선택해보세요!</p>
            </Card>
          ) : (
            routines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-4 transition-all ${
                    routine.completed ? 'bg-green-50 border-green-300' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleComplete(routine.id)}
                      className="flex-shrink-0 mt-1"
                    >
                      {routine.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3
                          className={routine.completed ? 'line-through text-gray-500' : ''}
                        >
                          {routine.day}
                        </h3>
                        {routine.completed && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            완료
                          </Badge>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {routine.workouts.map((workout, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2"
                          >
                            <button
                              onClick={() => toggleWorkoutComplete(routine.id, idx)}
                              className="flex-shrink-0 mt-0.5"
                            >
                              {workout.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <span
                              className={`text-sm ${
                                workout.completed
                                  ? 'line-through text-gray-500'
                                  : routine.completed
                                  ? 'text-gray-500'
                                  : 'text-gray-700'
                              }`}
                            >
                              {workout.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
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

      {/* Tips */}
      {!showCalendarView && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>💡 Tip:</strong> 각 운동 항목을 개별적으로 체크하거나, 요일 전체를 한 번에 완료할 수 있어요!
          </p>
        </Card>
      )}
    </div>
  );
}