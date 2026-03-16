import { Dumbbell, Calendar, TrendingUp, Utensils, Trophy, MessageSquare, BookOpen, Bot, User } from 'lucide-react';

interface HomePageProps {
    user: { name: string; email: string; profile_picture?: string } | null;
    onNavigate: (page: 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board') => void;
    onMyPageClick: () => void;
    onDictionaryClick: () => void;
}

const menuItems = [
    {
        id: 'workout',
        label: '운동 가이드',
        icon: Dumbbell,
        color: 'bg-blue-500',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
    },
    {
        id: 'routine',
        label: '루틴 플래너',
        icon: Calendar,
        color: 'bg-emerald-500',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
    },
    {
        id: 'progress',
        label: '진척도',
        icon: TrendingUp,
        color: 'bg-orange-500',
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
    {
        id: 'diet',
        label: '식단 관리',
        icon: Utensils,
        color: 'bg-teal-500',
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-500',
    },
    {
        id: 'competition',
        label: 'SBD 대회',
        icon: Trophy,
        color: 'bg-purple-500',
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-500',
    },
    {
        id: 'board',
        label: '게시판',
        icon: MessageSquare,
        color: 'bg-indigo-500',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-500',
    },
];

const specialItems = [
    {
        id: 'dictionary' as const,
        label: '운동 사전',
        icon: BookOpen,
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-500',
    },
    {
        id: 'ai' as const,
        label: 'AI 피드백',
        icon: Bot,
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-500',
    },
    {
        id: 'mypage' as const,
        label: '마이페이지',
        icon: User,
        iconBg: 'bg-cyan-50',
        iconColor: 'text-cyan-500',
    },
];

export function HomePage({ user, onNavigate, onMyPageClick, onDictionaryClick }: HomePageProps) {
    const handleSpecialClick = (id: string) => {
        switch (id) {
            case 'dictionary':
                onDictionaryClick();
                break;
            case 'mypage':
                onMyPageClick();
                break;
            case 'ai':
                alert('AI 피드백 기능은 준비 중입니다! 곧 만나보실 수 있어요 🚀');
                break;
        }
    };

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

                {specialItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleSpecialClick(item.id)}
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
