import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Droplets, Flame, HeartPulse, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ProgressProps {
  user: { name: string; email: string } | null;
}

interface WorkoutLog {
  id: string;
  date: string;
  minutes: number;
  type: string;
}

const mondayBasedIndex = (date: Date) => (date.getDay() + 6) % 7;

const getSeed = (value: string) =>
  value.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);

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

  const seed = getSeed(user?.email || user?.name || 'fitin');
  const sortedLogs = useMemo(
    () => [...workoutLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [workoutLogs],
  );

  const totalMinutes = workoutLogs.reduce((acc, log) => acc + log.minutes, 0);
  const totalWorkouts = workoutLogs.length;
  const activeDays = new Set(workoutLogs.map((log) => new Date(log.date).toDateString())).size || 1;
  const averageMinutes = Math.round(totalMinutes / activeDays) || 0;
  const dailyCalories = 1850 + averageMinutes * 8 + (seed % 130);
  const restingHeartRate = Math.max(56, 68 - Math.min(10, Math.round(totalWorkouts / 3)) + (seed % 4));
  const hydrationLiters = Number((1.4 + Math.min(totalMinutes / 700, 0.7) + ((seed % 5) * 0.08)).toFixed(1));

  const handleAddWorkout = () => {
    if (!newWorkoutType.trim()) {
      alert('운동 종류를 입력해주세요.');
      return;
    }

    const newLog: WorkoutLog = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      minutes: newWorkoutMinutes,
      type: newWorkoutType.trim(),
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);
    setShowAddDialog(false);
    setNewWorkoutType('');
    setNewWorkoutMinutes(30);
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm('이 운동 기록을 삭제하시겠습니까?')) {
      setWorkoutLogs((prev) => prev.filter((log) => log.id !== id));
    }
  };

  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const todayIndex = mondayBasedIndex(now);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyData = weekdayLabels.map((label, index) => {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + index);

    const minutes = workoutLogs
      .filter((log) => new Date(log.date).toDateString() === currentDate.toDateString())
      .reduce((acc, log) => acc + log.minutes, 0);

    return {
      label,
      value: minutes || 12 + ((seed + index * 19) % 60),
      active: index === todayIndex,
    };
  });

  const monthlyData = ['W1', 'W2', 'W3', 'W4'].map((label, index) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - index * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const minutes = workoutLogs
      .filter((log) => {
        const date = new Date(log.date);
        return date >= weekStart && date <= weekEnd;
      })
      .reduce((acc, log) => acc + log.minutes, 0);

    return {
      label,
      value: minutes || 140 + ((seed + index * 31) % 90),
      active: index === 0,
    };
  }).reverse();

  const chartData = timeRange === 'week' ? weeklyData : monthlyData;
  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);

  const recentWorkouts = sortedLogs.slice(0, 5);

  const activityDelta = Math.max(6, Math.min(24, Math.round((averageMinutes / 120) * 100) || 12));

  const minuteOptions = [15, 20, 30, 40, 45, 60, 75, 90];

  return (
    <div className="space-y-6 px-1 py-2">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="apple-kicker">Performance</p>
              <h1 className="mt-3 text-[clamp(2.3rem,6vw,4.5rem)] font-black leading-[0.94] tracking-[-0.08em] text-foreground">
                {user?.name || 'Fitin'}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowAddDialog(true)}
              className="apple-button h-11 gap-2 px-5"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="apple-panel p-6 sm:p-7">
              <p className="apple-kicker">Avg Activity</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-6xl font-black tracking-[-0.08em] text-foreground">{averageMinutes || 84}</span>
                <span className="pb-2 text-2xl text-foreground/80">min/day</span>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Activity className="h-4 w-4" />
                +{activityDelta}% from last week
              </p>
            </div>

            <div className="apple-panel p-6 sm:p-7">
              <p className="apple-kicker">Daily Calories</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-6xl font-black tracking-[-0.08em] text-foreground">{dailyCalories.toLocaleString()}</span>
                <span className="pb-2 text-2xl text-foreground/80">kcal</span>
              </div>
              <div className="mt-8 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#0e62ff,#1a74ff)]"
                  style={{ width: `${Math.min(100, Math.round((dailyCalories / 2800) * 100))}%` }}
                />
              </div>
            </div>

            <div className="apple-panel overflow-hidden bg-[linear-gradient(140deg,#1565d8,#0f57c8)] p-6 text-white sm:col-span-2 xl:col-span-1 sm:p-7">
              <div className="absolute right-[-40px] top-[-28px] h-36 w-36 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/72">Resting Heart Rate</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-6xl font-black tracking-[-0.08em]">{restingHeartRate}</span>
                  <span className="pb-2 text-2xl text-white/84">bpm</span>
                </div>
                <div className="mt-8 flex items-end gap-2">
                  {[18, 34, 44, 22, 50, 16, 40].map((height, index) => (
                    <span
                      key={index}
                      className="w-1.5 rounded-full bg-white/70"
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="apple-panel p-6 sm:p-7">
              <p className="apple-kicker">Hydration</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-5xl font-black tracking-[-0.08em] text-foreground">{hydrationLiters}L</p>
                  <p className="mt-2 text-sm text-muted-foreground">Steady progress toward your daily hydration goal.</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-primary">
                  <Droplets className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="apple-panel p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="apple-kicker">Insights</p>
                <h2 className="mt-2 text-[2rem] font-black leading-none tracking-[-0.06em] text-foreground">
                  Activity Breakdown
                </h2>
              </div>

              <div className="inline-flex rounded-full border border-white/80 bg-slate-100 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                {(['week', 'month'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTimeRange(range)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                      timeRange === range
                        ? 'bg-white text-foreground shadow-[0_8px_20px_rgba(15,23,42,0.08)]'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {range === 'week' ? 'Week' : 'Month'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex h-[320px] items-end gap-3 overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(241,244,250,0.92),rgba(247,248,251,0.76))] px-4 pb-4 pt-8 sm:px-6">
              {chartData.map((item) => (
                <div key={item.label} className="flex h-full flex-1 flex-col items-center gap-4">
                  <div className="flex h-full w-full items-end justify-center rounded-[22px] bg-white/55 px-1.5 pb-2">
                    <div
                      className={`w-full rounded-[20px] ${
                        item.active
                          ? 'bg-[linear-gradient(180deg,#1b6cff,#0f58e8)] shadow-[0_14px_28px_rgba(20,99,255,0.24)]'
                          : 'bg-[linear-gradient(180deg,#d7ddec,#eef2f8)]'
                      }`}
                      style={{ height: `${Math.max(16, Math.round((item.value / maxChartValue) * 100))}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold tracking-[0.14em] ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="px-1">
              <h3 className="text-[1.9rem] font-black leading-none tracking-[-0.06em] text-foreground">
                Recent Workouts
              </h3>
            </div>

            {recentWorkouts.length === 0 ? (
              <div className="apple-panel p-8 text-center">
                <p className="text-base text-muted-foreground">아직 기록된 운동이 없어요. 첫 세션을 추가해 보세요.</p>
              </div>
            ) : (
              recentWorkouts.map((workout, index) => {
                const calories = Math.round(workout.minutes * 8.3 + 120);
                const distance = (workout.minutes / 12).toFixed(1);
                const iconSet = [Activity, Flame, HeartPulse];
                const Icon = iconSet[index % iconSet.length];

                return (
                  <div key={workout.id} className="apple-panel flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xl font-bold tracking-[-0.04em] text-foreground">{workout.type}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(workout.date))}
                          {' • '}
                          {distance} km
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{workout.minutes} min</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black tracking-[-0.06em] text-foreground">{calories}</p>
                      <p className="text-sm text-muted-foreground">kcal</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.section>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[30px] border-white/80 bg-white/90 p-0 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:max-w-lg">
          <div className="p-6 sm:p-7">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-[2rem] font-black tracking-[-0.06em] text-foreground">
                Add Workout
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                빠르게 기록하고 오늘의 활동 흐름에 반영해 보세요.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workout Type</Label>
                <Input
                  value={newWorkoutType}
                  onChange={(event) => setNewWorkoutType(event.target.value)}
                  placeholder="Morning Run"
                  className="apple-input border-0"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Duration</Label>
                <div className="grid grid-cols-4 gap-2">
                  {minuteOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setNewWorkoutMinutes(option)}
                      className={`rounded-[18px] border px-3 py-3 text-sm font-semibold transition-all ${
                        newWorkoutMinutes === option
                          ? 'border-primary bg-primary text-white shadow-[0_12px_28px_rgba(20,99,255,0.26)]'
                          : 'border-white/80 bg-slate-50 text-foreground'
                      }`}
                    >
                      {option}m
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddWorkout} className="apple-button h-14 w-full border-0 text-base">
                Save Workout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
