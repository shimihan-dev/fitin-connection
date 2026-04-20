import { lazy, Suspense, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { WelcomeSlides } from './components/WelcomeSlides';
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
const AdminDashboard  = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// PT 기능 (Phase 4 - 나중에 추가)
const TrainerDashboard = lazy(() => import('./components/TrainerDashboard'));

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board' | 'admin';
type WorkoutTab = 'routine' | 'running' | 'diet';
type RoutineSubTab = 'planner' | 'upper' | 'lower';

interface AppLocationState {
  currentPage: Page;
  workoutTab: WorkoutTab;
  routineSubTab: RoutineSubTab;
  isSignupPage: boolean;
}

interface NavigationOptions {
  workoutTab?: WorkoutTab;
  routineSubTab?: RoutineSubTab;
  replace?: boolean;
}

const appPages: Page[] = ['home', 'workout', 'routine', 'progress', 'diet', 'competition', 'board', 'admin'];
const workoutTabs: WorkoutTab[] = ['routine', 'running', 'diet'];
const routineSubTabs: RoutineSubTab[] = ['planner', 'upper', 'lower'];

const isPage = (value: string | null): value is Page =>
  Boolean(value && appPages.includes(value as Page));

const isWorkoutTab = (value: string | null): value is WorkoutTab =>
  Boolean(value && workoutTabs.includes(value as WorkoutTab));

const isRoutineSubTab = (value: string | null): value is RoutineSubTab =>
  Boolean(value && routineSubTabs.includes(value as RoutineSubTab));

const readAppLocation = (): AppLocationState => {
  if (typeof window === 'undefined') {
    return {
      currentPage: 'home',
      workoutTab: 'routine',
      routineSubTab: 'planner',
      isSignupPage: false,
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    currentPage: isPage(params.get('appPage')) ? (params.get('appPage') as Page) : 'home',
    workoutTab: isWorkoutTab(params.get('workoutTab'))
      ? (params.get('workoutTab') as WorkoutTab)
      : 'routine',
    routineSubTab: isRoutineSubTab(params.get('routineTab'))
      ? (params.get('routineTab') as RoutineSubTab)
      : 'planner',
    isSignupPage: params.get('page') === 'signup',
  };
};

const writeAppLocation = (
  currentPage: Page,
  workoutTab: WorkoutTab,
  routineSubTab: RoutineSubTab,
  replace = false,
) => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('page');

  if (currentPage === 'home') {
    url.searchParams.delete('appPage');
  } else {
    url.searchParams.set('appPage', currentPage);
  }

  if (currentPage === 'workout') {
    url.searchParams.set('workoutTab', workoutTab);
    if (workoutTab === 'routine') {
      url.searchParams.set('routineTab', routineSubTab);
    } else {
      url.searchParams.delete('routineTab');
    }
  } else {
    url.searchParams.delete('workoutTab');
    url.searchParams.delete('routineTab');
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const state = { currentPage, workoutTab, routineSubTab };

  if (replace) {
    window.history.replaceState(state, '', nextUrl);
  } else {
    window.history.pushState(state, '', nextUrl);
  }
};

const PageSpinner = () => (
  <div className="flex justify-center items-center pt-20">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
  </div>
);

export default function App() {
  const { t } = useLanguage();
  const { user, handleLogout, handleLoginSuccess, loading } = useAuth();
  const initialLocation = readAppLocation();

  const [currentPage, setCurrentPage]           = useState<Page>(initialLocation.currentPage);
  const [workoutTab, setWorkoutTab]             = useState<WorkoutTab>(initialLocation.workoutTab);
  const [routineSubTab, setRoutineSubTab]       = useState<RoutineSubTab>(initialLocation.routineSubTab);
  const [isSignupPage, setIsSignupPage]         = useState(initialLocation.isSignupPage);
  const [showMyPage, setShowMyPage]             = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginDialog, setShowLoginDialog]   = useState(false);
  const [showResetDialog, setShowResetDialog]   = useState(false);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(false);

  useEffect(() => {
    const syncFromLocation = () => {
      const nextLocation = readAppLocation();
      setCurrentPage(nextLocation.currentPage);
      setWorkoutTab(nextLocation.workoutTab);
      setRoutineSubTab(nextLocation.routineSubTab);
      setIsSignupPage(nextLocation.isSignupPage);
      setShowMyPage(false);
      setShowNotifications(false);
    };

    window.addEventListener('popstate', syncFromLocation);

    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  const navigateTo = (page: Page, options: NavigationOptions = {}) => {
    const nextPage = page === 'admin' && !user ? 'home' : page;
    const nextWorkoutTab =
      options.workoutTab ?? (nextPage === 'workout' ? workoutTab : 'routine');
    const nextRoutineSubTab =
      options.routineSubTab ??
      (nextPage === 'workout' && nextWorkoutTab === 'routine' ? routineSubTab : 'planner');

    setCurrentPage(nextPage);
    setWorkoutTab(nextWorkoutTab);
    setRoutineSubTab(nextRoutineSubTab);
    setShowMyPage(false);
    setShowNotifications(false);
    writeAppLocation(nextPage, nextWorkoutTab, nextRoutineSubTab, options.replace);
  };

  const handleWorkoutViewChange = (nextWorkoutTab: WorkoutTab, nextRoutineSubTab: RoutineSubTab) => {
    setWorkoutTab(nextWorkoutTab);
    setRoutineSubTab(nextRoutineSubTab);

    if (currentPage === 'workout') {
      writeAppLocation('workout', nextWorkoutTab, nextRoutineSubTab, true);
    }
  };

  const closeSignupPage = () => {
    setIsSignupPage(false);
    writeAppLocation(currentPage, workoutTab, routineSubTab, true);
  };

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
    setShowNotifications(false);
    setCurrentPage('home');
    setWorkoutTab('routine');
    setRoutineSubTab('planner');
    writeAppLocation('home', 'routine', 'planner', true);
    alert(t('auth.logged_out'));
  };

  const handleGuestNavigate = (page: Page, options?: NavigationOptions) => {
    navigateTo(page === 'admin' ? 'home' : page, options);
  };

  // ── 회원가입 페이지 ──────────────────────────────────────────
  if (isSignupPage) {
    return (
      <SignupPage
        onClose={closeSignupPage}
        onLoginClick={closeSignupPage}
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

  const renderGuestPage = () => {
    switch (currentPage) {
      case 'home':        return <HomePage user={null} onNavigate={handleGuestNavigate} />;
      case 'workout':
        return (
          <WorkoutGuide
            user={null}
            initialTab={workoutTab}
            initialRoutineSubTab={routineSubTab}
            onViewChange={handleWorkoutViewChange}
          />
        );
      case 'competition': return <CompetitionPage user={null} />;
      case 'routine':     return <RoutinePlanner user={null} />;
      case 'progress':    return <Progress user={null} onNavigate={handleGuestNavigate} />;
      case 'diet':        return <Diet user={null} />;
      case 'board':       return <Board user={null} />;
      default:            return <HomePage user={null} onNavigate={handleGuestNavigate} />;
    }
  };

  // ── 비로그인 → 공개 메인 ────────────────────────────────────
  if (!user) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
        <Header
          user={null}
          currentPage={currentPage}
          onNavigate={handleGuestNavigate}
          onLogout={() => setShowLoginDialog(true)}
          onLoginClick={() => setShowLoginDialog(true)}
          onSignupClick={() => setIsSignupPage(true)}
          onMyPageClick={() => setShowLoginDialog(true)}
          onNotificationsClick={() => setShowLoginDialog(true)}
          showBackButton={currentPage !== 'home'}
          onBack={() => navigateTo('home')}
        />

        <main className="flex-1 overflow-y-auto pt-18 scroll-smooth pb-24 md:pb-0">
          <div className="mx-auto max-w-[1520px] px-4 pb-10 sm:px-6 lg:px-8">
            <Suspense fallback={<PageSpinner />}>
              {renderGuestPage()}
            </Suspense>
          </div>
        </main>

        <div className="md:hidden">
          <Navigation currentPage={currentPage} onNavigate={handleGuestNavigate} />
        </div>

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
      case 'home':        return <HomePage user={user} onNavigate={navigateTo} />;
      case 'workout':
        return (
          <WorkoutGuide
            user={user}
            initialTab={workoutTab}
            initialRoutineSubTab={routineSubTab}
            onViewChange={handleWorkoutViewChange}
          />
        );
      case 'competition': return <CompetitionPage user={user} />;
      case 'routine':     return <RoutinePlanner user={user} />;
      case 'progress':    return <Progress user={user} onNavigate={navigateTo} />;
      case 'diet':        return <Diet user={user} />;
      case 'board':       return <Board user={user} />;
      case 'admin':       return <AdminDashboard onBack={() => navigateTo('home')} />;
      default:            return <HomePage user={user} onNavigate={navigateTo} />;
    }
  };

  const showBottomNav = !showMyPage && !showNotifications;

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      {showWelcomeSlides && (
        <WelcomeSlides onComplete={() => setShowWelcomeSlides(false)} />
      )}

      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onLogout={handleLogoutWithRedirect}
        onLoginSuccess={handleLoginSuccessWithSlides}
        onMyPageClick={() => setShowMyPage(true)}
        onNotificationsClick={() => { setShowNotifications(true); setShowMyPage(false); }}
        showBackButton={showMyPage || showNotifications || currentPage !== 'home'}
        onBack={() => navigateTo('home')}
      />

      <main className={`flex-1 overflow-y-auto pt-18 scroll-smooth ${showBottomNav ? 'pb-24 md:pb-0' : ''}`}>
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 pb-10">
          <Suspense fallback={<PageSpinner />}>
            {showNotifications ? (
              <NotificationsPage />
            ) : showMyPage ? (
              <MyPage
                user={user}
                onBack={() => navigateTo('home')}
                onAdminClick={() => {
                  setShowMyPage(false);
                  navigateTo('admin');
                }}
              />
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
            onNavigate={navigateTo}
          />
        </div>
      )}
    </div>
  );
}
