import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

export function CalendarPage() {
  const { user } = useAuth();
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // 16회 목표 설정
  const GOAL_ACTIVITIES = 16;
  const currentActivities = activeDates.size;
  const progressRatio = Math.min((currentActivities / GOAL_ACTIVITIES) * 100, 100);

  useEffect(() => {
    if (!user?.id) return;
    
    // 이번 달 데이터 조회
    const fetchMonthData = async () => {
      const gte = new Date(currentYear, currentMonth, 1).toISOString();
      const lte = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString();
      
      const { data, error } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', gte)
        .lte('date', lte);

      if (!error && data) {
        const datesSet = new Set<string>(data.map((d: any) => new Date(d.date).getDate().toString()));
        setActiveDates(datesSet);
      }
    };
    
    fetchMonthData();
  }, [user?.id, currentMonth, currentYear]);

  // 달력 날짜 계산
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="w-10 h-10" />);
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString();
    const isToday = day === today.getDate().toString();
    const isActive = activeDates.has(day);

    return (
      <div 
        key={day} 
        className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'bg-slate-100 text-muted-foreground'
        } ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
      >
        {day}
      </div>
    );
  });

  return (
    <div className="space-y-6 max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">운동 캘린더</h1>
      
      <div className="apple-panel p-6 shadow-sm border border-border">
        <div className="text-lg font-bold text-center mb-4 text-primary">
          {currentYear}년 {currentMonth + 1}월
        </div>
        <div className="grid grid-cols-7 gap-2 place-items-center mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
            <div key={d} className="font-semibold text-xs text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 place-items-center">
          {blanks}
          {days}
        </div>
      </div>

      <div className="apple-panel p-6 shadow-sm border border-border">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-foreground">이번 달 달성률</span>
          <span className="text-sm font-semibold text-primary">{currentActivities} / {GOAL_ACTIVITIES}일</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressRatio}%` }}
          />
        </div>
      </div>
    </div>
  );
}
