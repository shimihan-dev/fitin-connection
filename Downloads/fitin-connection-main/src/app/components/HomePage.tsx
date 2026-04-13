import { Dumbbell, Calendar, TrendingUp, Utensils, Trophy, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../data/translations';

interface HomePageProps {
    user: { name: string; email: string; profile_picture?: string } | null;
    onNavigate: (page: 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board') => void;
}

const menuItems: { id: any; labelKey: TranslationKey; icon: any; iconBg: string; iconColor: string }[] = [
    {
        id: 'workout',
        labelKey: 'home.menu.workout',
        icon: Dumbbell,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
    },
    {
        id: 'routine',
        labelKey: 'home.menu.routine',
        icon: Calendar,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
    },
    {
        id: 'progress',
        labelKey: 'home.menu.progress',
        icon: TrendingUp,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
    {
        id: 'diet',
        labelKey: 'home.menu.diet',
        icon: Utensils,
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-500',
    },
    {
        id: 'competition',
        labelKey: 'home.menu.competition',
        icon: Trophy,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-500',
    },
    {
        id: 'board',
        labelKey: 'home.menu.board',
        icon: MessageSquare,
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-500',
    },
];

export function HomePage({ user, onNavigate }: HomePageProps) {
    const { t } = useLanguage();

    return (
        <div className="py-6">
            {/* Greeting */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                    {user?.name 
                        ? t('home.user_greeting').replace('{name}', user.name)
                        : t('home.greeting') + ' 👋'}
                </h2>
                <p className="text-muted-foreground mt-1">{t('home.sub_greeting')}</p>
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
                            <span className="text-xs sm:text-sm font-medium text-foreground">{t(item.labelKey)}</span>
                        </button>
                    );
                })}
            </div>

            {/* Quick Stats Banner */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/90">{t('home.goal.title')}</p>
                        <p className="text-2xl font-bold mt-1">{t('home.goal.fighting')}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <Dumbbell className="w-7 h-7 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
