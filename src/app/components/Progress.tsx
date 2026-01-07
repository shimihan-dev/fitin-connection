import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Target, Flame, Calendar as CalendarIcon, PlusCircle, Trash2, X } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressProps {
  user: { name: string; email: string } | null;
}

interface WorkoutLog {
  id: string;
  date: string;
  minutes: number;
  type: string;
}

export function Progress({ user }: ProgressProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem(`workouts_${user?.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  // 운동 추가 다이얼로그 상태
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newWorkoutType, setNewWorkoutType] = useState('');
  const [newWorkoutMinutes, setNewWorkoutMinutes] = useState(30);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`workouts_${user.email}`, JSON.stringify(workoutLogs));
    }
  }, [workoutLogs, user?.email]);

  const handleAddWorkout = () => {
    if (!newWorkoutType.trim()) {
      alert('운동 종류를 입력해주세요.');
      return;
    }

    const newLog: WorkoutLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      minutes: newWorkoutMinutes,
      type: newWorkoutType.trim(),
    };
    setWorkoutLogs([...workoutLogs, newLog]);
    setShowAddDialog(false);
    setNewWorkoutType('');
    setNewWorkoutMinutes(30);
    alert(`운동이 기록되었습니다! (${newWorkoutType} +${newWorkoutMinutes}분)`);
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm('이 운동 기록을 삭제하시겠습니까?')) {
      setWorkoutLogs(workoutLogs.filter(log => log.id !== id));
    }
  };

  // 통계 계산
  const totalWorkouts = workoutLogs.length;
  const totalMinutes = workoutLogs.reduce((acc, log) => acc + log.minutes, 0);

  // 연속 운동일 계산 (단순화)
  const calculateStreak = () => {
    if (workoutLogs.length === 0) return 0;
    return workoutLogs.length > 0 ? 1 : 0;
  };
  const currentStreak = calculateStreak();

  // 이번 주 운동 기록 필터링
  const getThisWeekLogs = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1; // 월요일 기준
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    return workoutLogs.filter(log => new Date(log.date) >= startOfWeek);
  };

  const thisWeekLogs = getThisWeekLogs();

  // 차트 데이터 생성
  const generateChartData = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];

    // 이번 주 월요일 계산
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return days.map((day, index) => {
      // 해당 요일의 날짜 계산
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + index);

      // 해당 날짜의 운동 기록 필터링
      const dayLogs = workoutLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.toDateString() === targetDate.toDateString();
      });

      const count = dayLogs.length;
      const mins = dayLogs.reduce((acc, log) => acc + log.minutes, 0);

      return {
        day,
        workouts: count,
        minutes: mins,
      };
    });
  };

  const chartData = generateChartData();

  // 배지 상태 계산
  const achievements = [
    {
      icon: Flame,
      title: '첫 시작',
      description: '첫 운동을 완료하세요!',
      unlocked: totalWorkouts >= 1,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Target,
      title: '작심삼일 탈출',
      description: '운동 3회 완료',
      unlocked: totalWorkouts >= 3,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      title: '운동 마니아',
      description: '운동 10회 완료',
      unlocked: totalWorkouts >= 10,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CalendarIcon,
      title: '끈기의 화신',
      description: '총 300분 운동 달성',
      unlocked: totalMinutes >= 300,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const unlockedBadges = achievements.filter(a => a.unlocked).length;

  const stats = [
    { label: '총 운동 횟수', value: `${totalWorkouts}회`, icon: TrendingUp, color: 'text-blue-600' },
    { label: '총 운동 시간', value: `${totalMinutes}분`, icon: CalendarIcon, color: 'text-green-600' },
    { label: '현재 연속', value: `${currentStreak}일`, icon: Flame, color: 'text-orange-600' },
    { label: '획득 배지', value: `${unlockedBadges}개`, icon: Award, color: 'text-purple-600' },
  ];

  // 시간 옵션 (10분 단위)
  const minuteOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">나의 진척도</h1>
              <p className="text-sm text-gray-600">성장하는 나를 확인하세요</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            오늘 운동 추가
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* Workout Frequency Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="mb-4">이번 주 활동</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" allowDecimals={false} domain={[0, 180]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="minutes" name="운동 시간(분)" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* This Week's Workout Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="mb-4">이번 주 운동 기록</h3>
          {thisWeekLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">
              이번 주에 기록된 운동이 없습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {['월', '화', '수', '목', '금', '토', '일'].map((dayName, dayIndex) => {
                const dayLogs = thisWeekLogs.filter(log => {
                  const logDay = new Date(log.date).getDay();
                  const adjustedDay = logDay === 0 ? 6 : logDay - 1;
                  return adjustedDay === dayIndex;
                });

                if (dayLogs.length === 0) return null;

                const dayTotal = dayLogs.reduce((sum, log) => sum + log.minutes, 0);

                return (
                  <div key={dayName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{dayName}요일</span>
                      <span className="text-sm text-green-600">총 {dayTotal}분</span>
                    </div>
                    <div className="space-y-2 pl-2 border-l-2 border-gray-200">
                      {dayLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg ml-2"
                        >
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-800">{log.type}</span>
                            <span className="text-xs text-gray-500">({log.minutes}분)</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWorkout(log.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="mb-4">달성 배지</h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={achievement.title}
                className={`p-4 ${achievement.unlocked
                  ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                  : 'opacity-60 grayscale bg-gray-50'
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-3 mx-auto`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-center text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs text-gray-600 text-center">
                  {achievement.description}
                </p>
                {achievement.unlocked ? (
                  <div className="text-center mt-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white text-xs">
                      달성 완료!
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center mt-2">
                    <Badge variant="outline" className="text-gray-400 text-xs text-[10px]">
                      미달성
                    </Badge>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Add Workout Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>오늘의 운동 추가</DialogTitle>
            <DialogDescription>
              완료한 운동을 기록하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="workout-type">운동 종류</Label>
              <Input
                id="workout-type"
                placeholder="예: 러닝, 웨이트, 요가, 수영..."
                value={newWorkoutType}
                onChange={(e) => setNewWorkoutType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>운동 시간</Label>
              <div className="grid grid-cols-4 gap-2">
                {minuteOptions.map((min) => (
                  <Button
                    key={min}
                    type="button"
                    variant={newWorkoutMinutes === min ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewWorkoutMinutes(min)}
                    className={newWorkoutMinutes === min ? 'bg-blue-600' : ''}
                  >
                    {min}분
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewWorkoutType('');
                  setNewWorkoutMinutes(30);
                }}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleAddWorkout}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                추가하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}