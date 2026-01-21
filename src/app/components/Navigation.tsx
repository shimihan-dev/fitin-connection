import { Home, Dumbbell, Calendar, TrendingUp, Utensils, Trophy, MessageSquare } from 'lucide-react';

type Page = 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'workout' as Page, icon: Dumbbell, label: '운동' },
    { id: 'competition' as Page, icon: Trophy, label: 'SBD대회' },
    { id: 'board' as Page, icon: MessageSquare, label: '게시판' },
    { id: 'progress' as Page, icon: TrendingUp, label: '진척도' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary/80'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
