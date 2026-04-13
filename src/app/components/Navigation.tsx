import { Activity, Compass, Dumbbell, Home, MessageSquare, Trophy } from 'lucide-react';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'home' as Page, icon: Home, label: 'Home' },
  { id: 'workout' as Page, icon: Dumbbell, label: 'Train' },
  { id: 'competition' as Page, icon: Trophy, label: 'Compete' },
  { id: 'board' as Page, icon: MessageSquare, label: 'Board' },
  { id: 'progress' as Page, icon: Activity, label: 'Progress' },
];

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto max-w-md rounded-full border border-white/85 bg-white/82 px-3 py-2 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
        <div className="grid grid-cols-5 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 rounded-full px-2 py-2.5 transition-all ${
                  isActive
                    ? 'bg-[linear-gradient(180deg,#1a6bff,#0a58ea)] text-white shadow-[0_12px_28px_rgba(20,99,255,0.28)]'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-[10px] font-semibold tracking-[0.12em] uppercase ${isActive ? 'text-white/92' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
