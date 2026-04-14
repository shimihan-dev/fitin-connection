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
import { Button } from './ui/button';
import { WorkoutDictionary } from './WorkoutDictionary';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  user: { name: string; email: string; profile_picture?: string } | null;
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
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/72 text-foreground shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white';

export function Header({
  user,
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
        <div className="mx-auto flex max-w-[1200px] items-center justify-between rounded-full border border-white/80 bg-white/72 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-5">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className={`${iconButtonClass} h-10 w-10`}
                aria-label={t('common.back')}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onMyPageClick?.()}
              className="flex items-center gap-3 rounded-full pr-2 transition-transform hover:scale-[1.01]"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffb44d,#ff9a3c_60%,#f0882a)] text-lg font-semibold text-slate-950 shadow-[0_10px_24px_rgba(255,153,46,0.28)]">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Daily Fitness
                </p>
                <p className="text-lg font-black tracking-[-0.04em] text-foreground">Fitin_Connection</p>
              </div>
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              className={`${iconButtonClass} px-3 w-auto gap-2`}
              aria-label="Change Language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold">{language === 'ko' ? 'KO' : 'EN'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowDictionary(true)}
              className={iconButtonClass}
              aria-label={t('header.dictionary')}
            >
              <BookOpen className="h-4 w-4" />
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
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => onNotificationsClick?.()}
              className={`${iconButtonClass} h-10 w-10`}
              aria-label={t('header.notifications')}
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className={`${iconButtonClass} h-10 w-10`}
              aria-label="Open menu"
            >
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="mx-auto mt-3 max-w-[1200px] md:hidden">
            <div className="apple-shell px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDictionary(true);
                    setShowMobileMenu(false);
                  }}
                  className="apple-soft-card flex items-center justify-between px-4 py-4 text-left"
                >
                  <span>
                    <span className="apple-kicker">Library</span>
                    <span className="mt-1 block text-sm font-semibold">Workout Dictionary</span>
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
                  <span>
                    <span className="apple-kicker">Language</span>
                    <span className="mt-1 block text-sm font-semibold">{language === 'ko' ? 'Switch to EN' : 'Switch to KO'}</span>
                  </span>
                  <Globe className="h-5 w-5 text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onMyPageClick?.();
                    setShowMobileMenu(false);
                  }}
                  className="apple-soft-card col-span-2 flex items-center justify-between px-4 py-4 text-left"
                >
                  <span>
                    <span className="apple-kicker">Profile</span>
                    <span className="mt-1 block text-sm font-semibold">{t('common.mypage')}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAccountDialog(true);
                    setShowMobileMenu(false);
                  }}
                  className="apple-soft-card col-span-2 flex items-center justify-between px-4 py-4 text-left"
                >
                  <span>
                    <span className="apple-kicker">Settings</span>
                    <span className="mt-1 block text-sm font-semibold">{t('common.system_settings')}</span>
                  </span>
                  <Settings2 className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <WorkoutDictionary open={showDictionary} onOpenChange={setShowDictionary} />

      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[28px] border-white/80 bg-white/88 p-0 shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:max-w-md">
          <div className="relative overflow-hidden rounded-[28px] p-6">
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(20,99,255,0.22),transparent_60%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_55%)]" />
            <DialogHeader className="relative space-y-2 text-left">
              <DialogTitle className="text-2xl font-black tracking-[-0.05em] text-foreground">
                {t('common.system_settings')}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                {user?.name || 'Fitin'} 계정과 앱 환경을 관리할 수 있어요.
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
                <div>
                  <p className="text-base font-semibold text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
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
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{t('common.mypage')}</span>
                    <span className="text-xs text-muted-foreground">프로필과 개인 설정</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAccountDialog(false);
                  onLogout();
                }}
                className="apple-soft-card flex w-full items-center justify-between px-4 py-4 text-left text-destructive"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-destructive">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t('common.logout')}</span>
                    <span className="text-xs text-muted-foreground">현재 세션에서 로그아웃</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
