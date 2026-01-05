import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { WorkoutGuide } from './components/WorkoutGuide';
import { RoutinePlanner } from './components/RoutinePlanner';
import { LifestyleTips } from './components/LifestyleTips';
import { Progress } from './components/Progress';
import { Diet } from './components/Diet';
import { MyPage } from './components/MyPage';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { SignupPage } from './components/SignupPage';
import { WelcomeSlides } from './components/WelcomeSlides';
import { LandingPage } from './components/LandingPage';
import { getCurrentUser, signOut, User } from '../../utils/auth';

type Page = 'home' | 'workout' | 'routine' | 'lifestyle' | 'progress' | 'diet';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isSignupPage, setIsSignupPage] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; id?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(false);

  // 로그인 성공 시 사용자 상태 업데이트 및 슬라이드 표시
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser({
      id: loggedInUser.id,
      name: loggedInUser.name || loggedInUser.email.split('@')[0] || '사용자',
      email: loggedInUser.email,
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 로그인하지 않은 경우 랜딩 페이지 표시
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} onSignupClick={() => setIsSignupPage(true)} />
        <div className="max-w-7xl mx-auto pt-16 pb-20">
          <LandingPage onStart={() => setIsSignupPage(true)} />
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} user={user} />;
      case 'workout':
        return <WorkoutGuide user={user} />;
      case 'routine':
        return <RoutinePlanner user={user} />;
      case 'lifestyle':
        return <LifestyleTips user={user} />;
      case 'progress':
        return <Progress user={user} />;
      case 'diet':
        return <Diet user={user} />;
      default:
        return <Home onNavigate={setCurrentPage} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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