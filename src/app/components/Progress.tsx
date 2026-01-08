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

  const totalWorkouts = workoutLogs.length;
  const totalMinutes = workoutLogs.reduce((acc, log) => acc + log.minutes, 0);

  const calculateStreak = () => {
    if (workoutLogs.length === 0) return 0;
    return workoutLogs.length > 0 ? 1 : 0;
  };
  const currentStreak = calculateStreak();

  const getThisWeekLogs = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    return workoutLogs.filter(log => new Date(log.date) >= startOfWeek);
  };

  const thisWeekLogs = getThisWeekLogs();

  const generateChartData = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return days.map((day, index) => {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + index);

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

  // 운동 횟수 기반 배지
  const workoutCountBadges = [
    { icon: Flame, title: '첫 시작', description: '첫 운동을 완료하세요!', unlocked: totalWorkouts >= 1, color: 'from-orange-500 to-red-500' },
    { icon: Target, title: '작심삼일 탈출', description: '운동 3회 완료', unlocked: totalWorkouts >= 3, color: 'from-green-500 to-green-600' },
    { icon: Award, title: '운동 마니아', description: '운동 10회 완료', unlocked: totalWorkouts >= 10, color: 'from-blue-500 to-blue-600' },
    { icon: Award, title: '피트니스 전사', description: '운동 25회 완료', unlocked: totalWorkouts >= 25, color: 'from-violet-500 to-purple-600' },
    { icon: Award, title: '헬스장 단골', description: '운동 50회 완료', unlocked: totalWorkouts >= 50, color: 'from-pink-500 to-rose-600' },
    { icon: Award, title: '운동 마스터', description: '운동 100회 달성!', unlocked: totalWorkouts >= 100, color: 'from-amber-500 to-yellow-600' },
  ];

  // 운동 시간 기반 배지
  const timeBadges = [
    { icon: CalendarIcon, title: '워밍업 완료', description: '총 60분 운동', unlocked: totalMinutes >= 60, color: 'from-cyan-500 to-cyan-600' },
    { icon: CalendarIcon, title: '끈기의 시작', description: '총 300분 운동', unlocked: totalMinutes >= 300, color: 'from-purple-500 to-purple-600' },
    { icon: CalendarIcon, title: '10시간 달성', description: '총 600분(10시간) 운동', unlocked: totalMinutes >= 600, color: 'from-indigo-500 to-indigo-600' },
    { icon: CalendarIcon, title: '마라톤 러너', description: '총 1000분 운동', unlocked: totalMinutes >= 1000, color: 'from-teal-500 to-teal-600' },
    { icon: CalendarIcon, title: '인내의 아이콘', description: '총 2000분 운동', unlocked: totalMinutes >= 2000, color: 'from-emerald-500 to-emerald-600' },
  ];

  // 이번 주 활동 기반 배지
  const weeklyBadges = [
    { icon: TrendingUp, title: '주 3회 챌린지', description: '이번 주 3회 운동', unlocked: thisWeekLogs.length >= 3, color: 'from-lime-500 to-lime-600' },
    { icon: TrendingUp, title: '주간 파이터', description: '이번 주 5회 운동', unlocked: thisWeekLogs.length >= 5, color: 'from-red-500 to-red-600' },
    { icon: TrendingUp, title: '매일매일 운동', description: '이번 주 7회 운동!', unlocked: thisWeekLogs.length >= 7, color: 'from-fuchsia-500 to-fuchsia-600' },
  ];

  // 모든 배지 합치기
  const achievements = [...workoutCountBadges, ...timeBadges, ...weeklyBadges];

  const unlockedBadges = achievements.filter(a => a.unlocked).length;

  const stats = [
    { label: '총 운동 횟수', value: `${totalWorkouts}회`, icon: TrendingUp, color: 'text-primary' },
    { label: '총 운동 시간', value: `${totalMinutes}분`, icon: CalendarIcon, color: 'text-emerald-400' },
    { label: '현재 연속', value: `${currentStreak}일`, icon: Flame, color: 'text-orange-400' },
    { label: '획득 배지', value: `${unlockedBadges}개`, icon: Award, color: 'text-violet-400' },
  ];

  const minuteOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">나의 진척도</h1>
              <p className="text-sm text-muted-foreground">성장하는 나를 확인하세요</p>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            오늘 운동 추가
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 bg-card/50 border-white/10">
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* Workout Frequency Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 bg-card/50 border-white/10">
          <h3 className="mb-4 font-semibold text-foreground">이번 주 활동</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} domain={[0, 180]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B0E14',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="minutes" name="운동 시간(분)" fill="#2F80FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* This Week's Workout Logs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6 bg-card/50 border-white/10">
          <h3 className="mb-4 font-semibold text-foreground">이번 주 운동 기록</h3>
          {thisWeekLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 text-sm">
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
                      <span className="font-medium text-foreground">{dayName}요일</span>
                      <span className="text-sm text-emerald-400">총 {dayTotal}분</span>
                    </div>
                    <div className="space-y-2 pl-2 border-l-2 border-white/10">
                      {dayLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-2 bg-background/50 rounded-lg ml-2 border border-white/5">
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-foreground">{log.type}</span>
                            <span className="text-xs text-muted-foreground">({log.minutes}분)</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkout(log.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6 p-0">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="mb-4 font-semibold text-foreground">달성 배지</h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={achievement.title}
                className={`p-4 ${achievement.unlocked
                  ? 'border-amber-400/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10'
                  : 'opacity-50 grayscale bg-card/30 border-white/5'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-center text-sm font-medium text-foreground mb-1">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground text-center">{achievement.description}</p>
                <div className="text-center mt-2">
                  {achievement.unlocked ? (
                    <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs">달성 완료!</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs border-white/10">미달성</Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Add Workout Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">오늘의 운동 추가</DialogTitle>
            <DialogDescription className="text-muted-foreground">완료한 운동을 기록하세요</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="workout-type" className="text-foreground">운동 종류</Label>
              <Input
                id="workout-type"
                placeholder="예: 러닝, 웨이트, 요가, 수영..."
                value={newWorkoutType}
                onChange={(e) => setNewWorkoutType(e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">운동 시간</Label>
              <div className="grid grid-cols-4 gap-2">
                {minuteOptions.map((min) => (
                  <Button
                    key={min}
                    type="button"
                    variant={newWorkoutMinutes === min ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewWorkoutMinutes(min)}
                    className={newWorkoutMinutes === min ? 'bg-primary' : 'border-white/10'}
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
                className="flex-1 border-white/10"
              >
                취소
              </Button>
              <Button onClick={handleAddWorkout} className="flex-1 bg-gradient-to-r from-primary to-blue-600">
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