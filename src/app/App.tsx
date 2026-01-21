import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { WorkoutGuide } from './components/WorkoutGuide';
import { RoutinePlanner } from './components/RoutinePlanner';
import { Progress } from './components/Progress';
import { Diet } from './components/Diet';
import { Board } from './components/Board';
import { MyPage } from './components/MyPage';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { SignupPage } from './components/SignupPage';
import { WelcomeSlides } from './components/WelcomeSlides';
import { OnboardingFlow } from './components/OnboardingFlow';
import { CompetitionPage } from './components/Competition/CompetitionPage';
import { getCurrentUser, signOut, User } from '../../utils/auth';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isSignupPage, setIsSignupPage] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; id?: string; profile_picture?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(false);

  // 로그인 성공 시 사용자 상태 업데이트 및 슬라이드 표시
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser({
      id: loggedInUser.id,
      name: loggedInUser.name || loggedInUser.email.split('@')[0] || '사용자',
      email: loggedInUser.email,
      profile_picture: loggedInUser.profile_picture,
    });
    setShowWelcomeSlides(true);
  };

  // 슬라이드 완료 시 닫기
  const handleWelcomeSlidesComplete = () => {
    setShowWelcomeSlides(false);
  };

  useEffect(() => {
    // URL 파라미터 체크해서 회원가입 페이지인지 확인
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page') === 'signup') {
      setIsSignupPage(true);
    }

    // 현재 로그인된 사용자 확인 (localStorage에서)
    checkUser();
  }, []);

  const checkUser = () => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          name: currentUser.name || currentUser.email.split('@')[0] || '사용자',
          email: currentUser.email,
          profile_picture: currentUser.profile_picture,
        });
      }
    } catch (error) {
      console.error('사용자 확인 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    setUser(null);
    setShowMyPage(false);
    alert('로그아웃되었습니다.');
  };

  // 회원가입 페이지인 경우
  if (isSignupPage) {
    return <SignupPage onClose={() => setIsSignupPage(false)} onLoginClick={() => setIsSignupPage(false)} />;
  }

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 로그인하지 않은 경우 온보딩 플로우 표시
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
        <OnboardingFlow
          onComplete={(completedUser) => {
            setUser({
              id: completedUser.id,
              name: completedUser.name || completedUser.email.split('@')[0] || '사용자',
              email: completedUser.email,
              profile_picture: completedUser.profile_picture,
            });
            setCurrentPage('workout'); // 온보딩 완료 후 운동 페이지로 이동
          }}
          onLoginClick={() => setShowLoginDialog(true)}
        />
        {/* 로그인 다이얼로그는 Header에서 제공 */}
        {showLoginDialog && (
          <div className="fixed inset-0 z-50">
            <Header
              user={null}
              onLogout={handleLogout}
              onLoginSuccess={handleLoginSuccess}
              onSignupClick={() => setShowLoginDialog(false)}
            />
          </div>
        )}
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} user={user} />;
      case 'workout':
        return <WorkoutGuide user={user} />;
      case 'competition':
        return <CompetitionPage user={user} />;
      case 'routine':
        return <RoutinePlanner user={user} />;
      case 'progress':
        return <Progress user={user} />;
      case 'diet':
        return <Diet user={user} />;
      case 'board':
        return <Board user={user} />;
      default:
        return <Home onNavigate={setCurrentPage} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Welcome Slides - 로그인 성공 시 표시 */}
      {showWelcomeSlides && (
        <WelcomeSlides onComplete={handleWelcomeSlidesComplete} />
      )}

      <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} onMyPageClick={() => setShowMyPage(true)} />
      <div className="max-w-7xl mx-auto pt-16 pb-20">
        {showMyPage ? (
          <MyPage user={user} onBack={() => setShowMyPage(false)} />
        ) : (
          renderPage()
        )}
      </div>
      {!showMyPage && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
    </div>
  );
}