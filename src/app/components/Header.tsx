import { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronRight,
  Dumbbell,
  Globe,
  LogOut,
  Menu,
  Settings2,
  User,
  X,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { WorkoutDictionary } from './WorkoutDictionary';
import { useLanguage } from '../contexts/LanguageContext';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

interface HeaderProps {
  user: { name: string; email: string; profile_picture?: string } | null;
  currentPage?: Page;
  onNavigate?: (page: Page) => void;
  onLogout: () => void;
  onLoginSuccess?: (_user: unknown) => void;
  onSignupClick?: () => void;
  onMyPageClick?: () => void;
  onNotificationsClick?: () => void;
  defaultShowLogin?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

const iconButtonClass =
  'flex h-10 w-10 items-center justify-center rounded-full bg-white/78 text-foreground shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white';

const navItems: { id: Page; label: string; match: (page?: Page) => boolean }[] = [
  { id: 'home', label: 'Dashboard', match: (page) => page === 'home' },
  { id: 'workout', label: 'Workouts', match: (page) => ['workout', 'routine', 'progress', 'competition'].includes(page || '') },
  { id: 'diet', label: 'Nutrition', match: (page) => page === 'diet' },
  { id: 'board', label: 'Community', match: (page) => page === 'board' },
];

export function Header({
  user,
  currentPage,
  onNavigate,
  onLogout,
  onMyPageClick,
  onNotificationsClick,
  showBackButton = false,
  onBack,
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'F';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1520px] items-center gap-4 rounded-full bg-white/66 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {showBackButton && (
              <button
                type="button"
                onClick={onBack}
                className={`${iconButtonClass} shrink-0`}
                aria-label={t('common.back')}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate?.('home')}
              className="flex min-w-0 items-center gap-3 rounded-full pr-1 text-left"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffcb75,#ffb14d_58%,#f59326)] text-slate-950 shadow-[0_12px_28px_rgba(245,147,38,0.28)]">
                <Dumbbell className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Daily Fitness
                </span>
                <span className="block truncate text-xl font-black tracking-[-0.06em] text-foreground">
                  Fitin_Connection
                </span>
              </span>
            </button>
          </div>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="inline-flex items-center gap-1 rounded-full bg-white/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              {navItems.map((item) => {
                const isActive = item.match(currentPage);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate?.(item.id)}
                    className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-primary shadow-[0_12px_24px_rgba(15,23,42,0.08)]'
                        : 'text-slate-500 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              className="apple-segmented px-3"
              aria-label="Change Language"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{language === 'ko' ? 'KO' : 'EN'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNotificationsClick?.()}
              className={iconButtonClass}
              aria-label={t('header.notifications')}
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowAccountDialog(true)}
              className={iconButtonClass}
              aria-label={t('common.system_settings')}
            >
              <Settings2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onMyPageClick?.()}
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,#edf4ff,#dbe8ff_58%,#c8dafc)] text-sm font-bold text-primary shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
              aria-label={t('common.mypage')}
            >
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt="profile" className="h-full w-full object-cover" />
              ) : (
                userInitial
              )}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => onNotificationsClick?.()}
              className={iconButtonClass}
              aria-label={t('header.notifications')}
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className={iconButtonClass}
              aria-label="Open menu"
            >
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="mx-auto mt-3 max-w-[1520px] md:hidden">
            <div className="apple-shell px-4 py-4">
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item) => {
                    const isActive = item.match(currentPage);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onNavigate?.(item.id);
                          setShowMobileMenu(false);
                        }}
                        className={`overflow-hidden whitespace-nowrap rounded-[22px] px-4 py-4 text-left text-sm font-semibold transition-all ${
                          isActive ? 'bg-blue-50 text-primary' : 'apple-soft-card'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDictionary(true);
                      setShowMobileMenu(false);
                    }}
                    className="apple-soft-card flex items-center justify-between px-4 py-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="apple-kicker">Library</span>
                      <span className="mt-1 block truncate whitespace-nowrap text-sm font-semibold">Workout Dictionary</span>
                    </span>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage(language === 'ko' ? 'en' : 'ko');
                      setShowMobileMenu(false);
                    }}
                    className="apple-soft-card flex items-center justify-between px-4 py-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="apple-kicker">Language</span>
                      <span className="mt-1 block truncate whitespace-nowrap text-sm font-semibold">{language === 'ko' ? 'Switch to EN' : 'Switch to KO'}</span>
                    </span>
                    <Globe className="h-5 w-5 text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onMyPageClick?.();
                      setShowMobileMenu(false);
                    }}
                    className="apple-soft-card flex items-center justify-between px-4 py-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="apple-kicker">Profile</span>
                      <span className="mt-1 block truncate whitespace-nowrap text-sm font-semibold">{t('common.mypage')}</span>
                    </span>
                    <User className="h-5 w-5 text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountDialog(true);
                      setShowMobileMenu(false);
                    }}
                    className="apple-soft-card flex items-center justify-between px-4 py-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="apple-kicker">Settings</span>
                      <span className="mt-1 block truncate whitespace-nowrap text-sm font-semibold">{t('common.system_settings')}</span>
                    </span>
                    <Settings2 className="h-5 w-5 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <WorkoutDictionary open={showDictionary} onOpenChange={setShowDictionary} />

      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[30px] border-white/80 bg-white/90 p-0 shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:max-w-md">
          <div className="relative overflow-hidden rounded-[30px] p-6">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(20,99,255,0.22),transparent_60%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_55%)]" />
            <DialogHeader className="relative space-y-2 text-left">
              <DialogTitle className="whitespace-nowrap text-2xl font-black tracking-[-0.05em] text-foreground">
                {t('common.system_settings')}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                {user?.name || 'Fitin'} 계정과 앱 환경을 한 곳에서 관리할 수 있어요.
              </DialogDescription>
            </DialogHeader>

            <div className="relative mt-6 apple-soft-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffb44d,#ff9a3c_60%,#f0882a)] text-lg font-semibold text-slate-950">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate whitespace-nowrap text-base font-semibold text-foreground">{user?.name}</p>
                  <p className="truncate whitespace-nowrap text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowAccountDialog(false);
                  onMyPageClick?.();
                }}
                className="apple-soft-card flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-sm font-semibold text-foreground">{t('common.mypage')}</span>
                    <span className="block truncate text-xs text-muted-foreground">프로필과 설정</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => setShowDictionary(true)}
                className="apple-soft-card flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-sm font-semibold text-foreground">Workout Dictionary</span>
                    <span className="block truncate text-xs text-muted-foreground">운동 사전 열기</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                className="apple-soft-card flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                    <Globe className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-sm font-semibold text-foreground">Language</span>
                    <span className="block truncate text-xs text-muted-foreground">{language === 'ko' ? 'English로 전환' : '한국어로 전환'}</span>
                  </span>
                </span>
                <span className="text-xs font-semibold text-primary">{language === 'ko' ? 'KO' : 'EN'}</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="apple-soft-card flex w-full items-center justify-between px-4 py-4 text-left text-destructive"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-destructive">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-sm font-semibold">Logout</span>
                    <span className="block truncate text-xs text-destructive/70">계정 로그아웃</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-destructive/60" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
