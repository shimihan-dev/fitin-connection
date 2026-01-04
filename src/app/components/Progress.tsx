import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Target, Flame, Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressProps {
  user: { name: string; email: string } | null;
}

interface WorkoutLog {
  date: string;
  minutes: number;
}

export function Progress({ user }: ProgressProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem(`workouts_${user?.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`workouts_${user.email}`, JSON.stringify(workoutLogs));
    }
  }, [workoutLogs, user?.email]);

  const handleAddWorkout = () => {
    const newLog = {
      date: new Date().toISOString(),
      minutes: 30, // 기본 30분
    };
    setWorkoutLogs([...workoutLogs, newLog]);
    alert('오늘의 운동이 기록되었습니다! (+30분)');
  };

  // 통계 계산
  const totalWorkouts = workoutLogs.length;
  const totalMinutes = workoutLogs.reduce((acc, log) => acc + log.minutes, 0);

  // 연속 운동일 계산 (단순화)
  const calculateStreak = () => {
    if (workoutLogs.length === 0) return 0;
    // 실제로는 날짜별 정렬 및 비교가 필요하지만, 데모용으로 간단히 처리
    return workoutLogs.length > 0 ? 1 : 0;
  };
  const currentStreak = calculateStreak();

  // 차트 데이터 생성
  const generateChartData = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const today = new Date().getDay(); // 0(일) ~ 6(토)
    // 월요일을 0으로 조정 (0:월 ~ 6:일)
    const adjustedToday = today === 0 ? 6 : today - 1;

    return days.map((day, index) => {
      // 간단히 오늘 기록한 횟수만큼 그래프에 표시 (실제 날짜 매핑은 생략하고 데모용)
      // 현재는 "오늘" 기록하면 해당 요일에만 데이터가 쌓이는 것으로 시각화
      let count = 0;
      let mins = 0;

      if (index === adjustedToday) {
        // 오늘 날짜에 해당하는 로그만 집계 (데모 로직)
        const todayLogs = workoutLogs.filter(log => {
          const logDate = new Date(log.date);
          return logDate.toDateString() === new Date().toDateString();
        });
        count = todayLogs.length;
        mins = todayLogs.reduce((acc, log) => acc + log.minutes, 0);
      }

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
            onClick={handleAddWorkout}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            오늘 운동 완료 (+30분)
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
              <YAxis stroke="#888" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="workouts" name="운동 횟수" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="minutes" name="운동 시간(분)" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
    </div>
  );
}