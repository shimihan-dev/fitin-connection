import {
  Dumbbell,
  Footprints,
  Grid2x2,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';
type RailSection = 'overview' | 'activity';

interface DashboardRailProps {
  user: { name: string; profile_picture?: string } | null;
  activeSection: RailSection;
  onNavigate: (page: Page) => void;
}

export function DashboardRail({ user, activeSection, onNavigate }: DashboardRailProps) {
  const { language } = useLanguage();
  const isKorean = language === 'ko';
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'F';

  const labels = isKorean
    ? {
        membership: '프리미엄 멤버',
        startWorkout: '바로 시작',
        weeklyGoal: '주간 목표',
        items: [
          { id: 'overview' as const, label: '개요', icon: Grid2x2, page: 'home' as Page },
          { id: 'running', label: '러닝', icon: Footprints, page: 'workout' as Page },
          { id: 'gym', label: '헬스', icon: Dumbbell, page: 'routine' as Page },
          { id: 'sbd', label: 'IGC SBD', icon: Trophy, page: 'competition' as Page },
          { id: 'community', label: '커뮤니티', icon: MessageSquare, page: 'board' as Page },
        ],
      }
    : {
        membership: 'Premium Member',
        startWorkout: 'Quick Start',
        weeklyGoal: 'Weekly Goal',
        items: [
          { id: 'overview' as const, label: 'Overview', icon: Grid2x2, page: 'home' as Page },
          { id: 'running', label: 'Running', icon: Footprints, page: 'workout' as Page },
          { id: 'gym', label: 'Gym', icon: Dumbbell, page: 'routine' as Page },
          { id: 'sbd', label: 'IGC SBD', icon: Trophy, page: 'competition' as Page },
          { id: 'community', label: 'Community', icon: MessageSquare, page: 'board' as Page },
        ],
      };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-5 lg:sticky lg:top-[108px] lg:h-fit">
      <div className="rounded-[30px] bg-white/52 px-4 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex items-center gap-3 rounded-[24px] bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_30%_30%,#edf4ff,#d9e7ff_58%,#c8dafc)] text-base font-bold text-primary">
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="profile" className="h-full w-full object-cover" />
            ) : (
              userInitial
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate whitespace-nowrap text-base font-bold tracking-[-0.03em] text-foreground">
              {user?.name || 'Fitin'} Elite
            </p>
            <p className="whitespace-nowrap text-xs text-muted-foreground">{labels.membership}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="whitespace-nowrap">Connected</span>
          <span className="whitespace-nowrap text-primary">6d streak</span>
        </div>
      </div>

      <nav className="rounded-[34px] bg-white/48 p-3 shadow-[0_22px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="space-y-1.5">
          {labels.items.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.id === 'overview' && activeSection === 'overview') ||
              (item.id === 'activity' && activeSection === 'activity');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.page)}
                className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-left text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-primary shadow-[0_14px_34px_rgba(15,23,42,0.08)]'
                    : 'text-slate-500 hover:bg-white/70 hover:text-foreground'
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-[16px] ${
                    isActive ? 'bg-blue-50 text-primary' : 'bg-transparent text-slate-500'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="rounded-[34px] bg-white/42 p-4 shadow-[0_22px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="rounded-[26px] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(246,249,255,0.72))] p-4">
          <div className="flex items-center justify-between">
            <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">
              {labels.weeklyGoal}
            </p>
            <span className="text-sm font-bold text-foreground">82%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div className="h-2 w-[82%] rounded-full bg-[linear-gradient(90deg,#0f63ff,#5d91ff)]" />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('workout')}
            className="mt-5 inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#0f63ff,#0b56dd)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(20,99,255,0.24)] transition-transform hover:-translate-y-0.5"
          >
            {labels.startWorkout}
          </button>
        </div>
      </div>
    </aside>
  );
}
