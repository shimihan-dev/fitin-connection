import { lazy, Suspense, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { WelcomeSlides } from './components/WelcomeSlides';
import { OnboardingFlow } from './components/OnboardingFlow';
import { SignupPage } from './components/SignupPage';
import { LoginDialog } from './components/auth/LoginDialog';
import { ResetPasswordDialog } from './components/auth/ResetPassWordDialog';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';

// ── 페이지 lazy import (초기 번들에서 분리) ────────────────────
const WorkoutGuide    = lazy(() => import('./components/WorkoutGuide').then(m => ({ default: m.WorkoutGuide })));
const RoutinePlanner  = lazy(() => import('./components/RoutinePlanner').then(m => ({ default: m.RoutinePlanner })));
const Progress        = lazy(() => import('./components/Progress').then(m => ({ default: m.Progress })));
const Diet            = lazy(() => import('./components/Diet').then(m => ({ default: m.Diet })));
const Board           = lazy(() => import('./components/Board').then(m => ({ default: m.Board })));
const MyPage          = lazy(() => import('./components/MyPage').then(m => ({ default: m.MyPage })));
const NotificationsPage = lazy(() => import('./components/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const CompetitionPage = lazy(() => import('./components/Competition/CompetitionPage').then(m => ({ default: m.CompetitionPage })));

// PT 기능 (Phase 4 - 나중에 추가)
const TrainerDashboard = lazy(() => import('./components/TrainerDashboard'));

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

const PageSpinner = () => (
  <div className="flex justify-center items-center pt-20">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
  </div>
);

export default function App() {
  const { t } = useLanguage();
  const { user, handleLogout, handleLoginSuccess, loading } = useAuth();

  const [currentPage, setCurrentPage]           = useState<Page>('home');
  const [isSignupPage, setIsSignupPage]         = useState(false);
  const [showMyPage, setShowMyPage]             = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginDialog, setShowLoginDialog]   = useState(false);
  const [showResetDialog, setShowResetDialog]   = useState(false);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'signup') setIsSignupPage(true);
  }, []);

  const handleLoginSuccessWithSlides = (loggedInUser: any) => {
    handleLoginSuccess(loggedInUser);
    const key = `igc_show_welcome_slides_${loggedInUser.id}`;
    if (localStorage.getItem(key) !== 'false') {
      setShowWelcomeSlides(true);
    }
  };

  const handleLogoutWithRedirect = () => {
    handleLogout();
    setShowMyPage(false);
    setCurrentPage('home');
    alert(t('auth.logged_out'));
  };

  // ── 회원가입 페이지 ──────────────────────────────────────────
  if (isSignupPage) {
    return (
      <SignupPage
        onClose={() => setIsSignupPage(false)}
        onLoginClick={() => setIsSignupPage(false)}
      />
    );
  }

  // ── 로딩 ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <span className="ml-3 text-sm text-muted-foreground">{t('common.loading')}</span>
      </div>
    );
  }

  // ── 비로그인 → 온보딩 ────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <OnboardingFlow
          onComplete={(completedUser) => {
            const email = completedUser.email || '';
            handleLoginSuccess({
              ...completedUser,
              name: completedUser.name || (email ? email.split('@')[0] : t('common.user')),
              email,
            } as any);
            setCurrentPage('workout');
          }}
          onLoginClick={() => setShowLoginDialog(true)}
        />

        <LoginDialog
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
          onForgotPassword={() => { setShowLoginDialog(false); setShowResetDialog(true); }}
        />
        <ResetPasswordDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          onBackToLogin={() => { setShowResetDialog(false); setShowLoginDialog(true); }}
        />
      </div>
    );
  }

  // ── 페이지 렌더 ──────────────────────────────────────────────
  const renderPage = () => {
    // Phase 4: role 기반 홈 분기 (트레이너용 대시보드)
    if (currentPage === 'home' && user.role === 'trainer') {
      return <TrainerDashboard />;
     }

    switch (currentPage) {
      case 'home':        return <HomePage user={user} onNavigate={setCurrentPage} />;
      case 'workout':     return <WorkoutGuide user={user} />;
      case 'competition': return <CompetitionPage user={user} />;
      case 'routine':     return <RoutinePlanner user={user} />;
      case 'progress':    return <Progress user={user} />;
      case 'diet':        return <Diet user={user} />;
      case 'board':       return <Board user={user} />;
      default:            return <HomePage user={user} onNavigate={setCurrentPage} />;
    }
  };

  const showBottomNav = currentPage !== 'home' && !showMyPage && !showNotifications;

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      {showWelcomeSlides && (
        <WelcomeSlides onComplete={() => setShowWelcomeSlides(false)} />
      )}

      <Header
        user={user}
        onLogout={handleLogoutWithRedirect}
        onLoginSuccess={handleLoginSuccessWithSlides}
        onMyPageClick={() => setShowMyPage(true)}
        onNotificationsClick={() => { setShowNotifications(true); setShowMyPage(false); }}
        showBackButton={currentPage !== 'home' || showMyPage || showNotifications}
        onBack={() => { setCurrentPage('home'); setShowMyPage(false); setShowNotifications(false); }}
      />

      <main className={`flex-1 overflow-y-auto pt-16 scroll-smooth ${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Suspense fallback={<PageSpinner />}>
            {showNotifications ? (
              <NotificationsPage />
            ) : showMyPage ? (
              <MyPage user={user} onBack={() => setShowMyPage(false)} />
            ) : (
              renderPage()
            )}
          </Suspense>
        </div>
      </main>

      {showBottomNav && (
        <div className="md:hidden">
          <Navigation
            currentPage={currentPage}
            onNavigate={(page) => {
              setCurrentPage(page);
              setShowMyPage(false);
              setShowNotifications(false);
            }}
          />
        </div>
      )}
    </div>
  );
}