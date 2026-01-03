import { Home, Dumbbell, Calendar, Heart, TrendingUp } from 'lucide-react';

type Page = 'home' | 'workout' | 'routine' | 'lifestyle' | 'progress';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: '홈' },
    { id: 'workout' as Page, icon: Dumbbell, label: '운동' },
    { id: 'routine' as Page, icon: Calendar, label: '루틴' },
    { id: 'lifestyle' as Page, icon: Heart, label: '라이프' },
    { id: 'progress' as Page, icon: TrendingUp, label: '진척도' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
