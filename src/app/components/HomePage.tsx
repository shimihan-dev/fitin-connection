import { Dumbbell, Calendar, TrendingUp, Utensils, Trophy, MessageSquare } from 'lucide-react';

interface HomePageProps {
    user: { name: string; email: string; profile_picture?: string } | null;
    onNavigate: (page: 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board') => void;
}

const menuItems = [
    {
        id: 'workout' as const,
        label: '운동 가이드',
        icon: Dumbbell,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
    },
    {
        id: 'routine' as const,
        label: '루틴 플래너',
        icon: Calendar,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
    },
    {
        id: 'progress' as const,
        label: '진척도',
        icon: TrendingUp,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
    {
        id: 'diet' as const,
        label: '식단 관리',
        icon: Utensils,
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-500',
    },
    {
        id: 'competition' as const,
        label: 'SBD 대회',
        icon: Trophy,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-500',
    },
    {
        id: 'board' as const,
        label: '게시판',
        icon: MessageSquare,
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-500',
    },
];

export function HomePage({ user, onNavigate }: HomePageProps) {
    return (
        <div className="py-6">
            {/* Greeting */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                    안녕하세요{user?.name ? `, ${user.name}님` : ''} 👋
                </h2>
                <p className="text-muted-foreground mt-1">오늘도 건강한 하루 보내세요!</p>
            </div>

            {/* Main Menu Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 active:scale-95 group"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${item.iconColor}`} />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-foreground">{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Quick Stats Banner */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/90">오늘의 운동 목표</p>
                        <p className="text-2xl font-bold mt-1">화이팅! 💪</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <Dumbbell className="w-7 h-7 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
