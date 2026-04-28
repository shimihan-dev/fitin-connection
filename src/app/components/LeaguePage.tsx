import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Medal, Award, Star } from 'lucide-react';

const GRADES = [
  { name: 'Gold', min: 16, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100', borderColor: 'border-yellow-400' },
  { name: 'Silver', min: 10, icon: Medal, color: 'text-zinc-500', bg: 'bg-zinc-100', borderColor: 'border-zinc-300' },
  { name: 'Bronze', min: 5, icon: Award, color: 'text-orange-600', bg: 'bg-orange-100', borderColor: 'border-orange-300' },
  { name: 'Starter', min: 0, icon: Star, color: 'text-slate-500', bg: 'bg-slate-100', borderColor: 'border-slate-200' },
];

export function LeaguePage() {
  const { user } = useAuth();
  const [monthlyCount, setMonthlyCount] = useState<number>(0);

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchMonthlyCount = async () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();
      
      const { count, error } = await supabase
        .from('workout_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('date', firstDay)
        .lte('date', lastDay);

      if (!error && count !== null) {
        setMonthlyCount(count);
      }
    };

    fetchMonthlyCount();
  }, [user?.id]);

  const currentGrade = GRADES.find(g => monthlyCount >= g.min) || GRADES[3];
  const nextGradeIndex = GRADES.findIndex(g => g.name === currentGrade.name) - 1;
  const nextGrade = nextGradeIndex >= 0 ? GRADES[nextGradeIndex] : null;

  const CurrentIcon = currentGrade.icon;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-10 pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-foreground">이달의 리그 등급</h1>
        <p className="text-muted-foreground text-sm">이번 달 운동 세션 횟수로 등급이 매겨집니다.</p>
      </div>

      <div className={`apple-panel p-8 sm:p-10 text-center relative overflow-hidden border-2 ${currentGrade.borderColor}`}>
        <div className={`absolute top-0 right-0 w-44 h-44 blur-3xl opacity-40 rounded-full ${currentGrade.bg}`} style={{ transform: 'translate(40%, -40%)' }}></div>
        
        <div className="flex justify-center mb-6 relative">
          <div className={`p-5 rounded-full ${currentGrade.bg}`}>
            <CurrentIcon className={`w-12 h-12 ${currentGrade.color}`} />
          </div>
        </div>
        
        <h2 className="text-4xl font-extrabold mb-2 relative">{currentGrade.name}</h2>
        <p className="text-lg font-medium text-muted-foreground relative">누적 {monthlyCount}회 달성</p>
        
        {nextGrade && (
          <div className="mt-8 relative bg-foreground/5 rounded-2xl p-4">
            <p className="text-sm font-semibold text-foreground">
              다음 등급 <span className="text-primary">{nextGrade.name}</span>까지 <span className="text-primary font-bold">{nextGrade.min - monthlyCount}회</span> 남았습니다!
            </p>
            <div className="w-full bg-foreground/10 rounded-full h-2.5 mt-3">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-700" 
                style={{ width: `${Math.min((monthlyCount / nextGrade.min) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="apple-panel p-6 shadow-sm border border-border">
        <h3 className="text-lg font-bold mb-4 ml-1">등급표 안내</h3>
        <div className="space-y-3">
          {GRADES.map((grade) => {
            const Icon = grade.icon;
            const isUserLevel = grade.name === currentGrade.name;

            return (
              <div 
                key={grade.name} 
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  isUserLevel 
                    ? `${grade.borderColor} ${grade.bg} shadow-md scale-[1.02] font-bold` 
                    : 'border-transparent bg-slate-50 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isUserLevel ? 'bg-white' : grade.bg}`}>
                    <Icon className={`w-5 h-5 ${grade.color}`} />
                  </div>
                  <span className={`text-base ${isUserLevel ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {grade.name}
                  </span>
                </div>
                <span className={`text-base ${isUserLevel ? 'text-primary' : 'text-muted-foreground'}`}>
                  {grade.min}회 이상
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
