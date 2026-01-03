import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Target, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressProps {
  user: { name: string; email: string } | null;
}

export function Progress({ user }: ProgressProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const weeklyData = [
    { day: '월', workouts: 1, minutes: 30 },
    { day: '화', workouts: 0, minutes: 0 },
    { day: '수', workouts: 1, minutes: 45 },
    { day: '목', workouts: 0, minutes: 0 },
    { day: '금', workouts: 1, minutes: 35 },
    { day: '토', workouts: 0, minutes: 0 },
    { day: '일', workouts: 1, minutes: 40 },
  ];

  const monthlyData = [
    { week: '1주', workouts: 3, minutes: 110 },
    { week: '2주', workouts: 4, minutes: 150 },
    { week: '3주', workouts: 3, minutes: 105 },
    { week: '4주', workouts: 4, minutes: 150 },
  ];

  const achievements = [
    {
      icon: Flame,
      title: '7일 연속',
      description: '일주일 동안 꾸준히!',
      unlocked: false,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Target,
      title: '첫 운동',
      description: '시작이 반이다!',
      unlocked: true,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      title: '10회 달성',
      description: '운동 10회 완료',
      unlocked: true,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CalendarIcon,
      title: '한 달 챌린지',
      description: '30일 연속 운동',
      unlocked: false,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const stats = [
    { label: '이번 주 운동', value: '4회', icon: TrendingUp, color: 'text-blue-600' },
    { label: '총 운동 시간', value: '150분', icon: CalendarIcon, color: 'text-green-600' },
    { label: '연속 운동', value: '3일', icon: Flame, color: 'text-orange-600' },
    { label: '달성 배지', value: '2개', icon: Award, color: 'text-purple-600' },
  ];

  const currentData = timeRange === 'week' ? weeklyData : monthlyData;
  const xDataKey = timeRange === 'week' ? 'day' : 'week';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">나의 진척도</h1>
            <p className="text-sm text-gray-600">성장하는 나를 확인하세요</p>
          </div>
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

      {/* Time Range Toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg transition-all ${
            timeRange === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          주간
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg transition-all ${
            timeRange === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          월간
        </button>
      </div>

      {/* Workout Frequency Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="mb-4">운동 횟수</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xDataKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="workouts" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Workout Minutes Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="mb-4">운동 시간 (분)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xDataKey} stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
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
                className={`p-4 ${
                  achievement.unlocked
                    ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                    : 'opacity-60 grayscale'
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
                {achievement.unlocked && (
                  <div className="text-center mt-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white text-xs">
                      달성!
                    </Badge>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h3 className="mb-2">🎉 잘하고 있어요!</h3>
          <p className="text-sm text-blue-100">
            꾸준함이 가장 중요합니다. 매일 조금씩 발전하는 자신을 응원합니다!
          </p>
        </Card>
      </motion.div>
    </div>
  );
}