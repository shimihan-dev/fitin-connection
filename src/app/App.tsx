import { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Button as UIButton } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { getCurrentUser, signOut, signIn, User } from '../../utils/auth';

type Page = 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('workout');
  const [isSignupPage, setIsSignupPage] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; id?: string; profile_picture?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(false);

  // 로그인 폼 상태
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);

  // 로그인 폼 핸들러
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { user: loggedInUser, error } = await signIn(loginData.email, loginData.password, rememberMe);
      if (error) {
        alert(error);
      } else if (loggedInUser) {
        setShowLoginDialog(false);
        setLoginData({ email: '', password: '' });
        handleLoginSuccess(loggedInUser);
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoginLoading(false);
    }
  };

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
        {/* 로그인 다이얼로그 */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>로그인</DialogTitle>
              <DialogDescription>
                Fitin_Connection에 오신 것을 환영합니다!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">이메일</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  disabled={loginLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  disabled={loginLoading}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="login-rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={loginLoading}
                />
                <label htmlFor="login-rememberMe" className="text-sm text-muted-foreground">
                  로그인 상태 유지하기
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <UIButton
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loginLoading}
                >
                  {loginLoading ? '로그인 중...' : '로그인'}
                </UIButton>
                <button
                  type="button"
                  onClick={() => setShowLoginDialog(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={loginLoading}
                >
                  취소
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
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
        return <WorkoutGuide user={user} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Welcome Slides - 로그인 성공 시 표시 */}
      {showWelcomeSlides && (
        <WelcomeSlides onComplete={handleWelcomeSlidesComplete} />
      )}

      <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} onMyPageClick={() => setShowMyPage(true)} />

      <main className="flex-1 overflow-y-auto pt-16">
        <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 lg:px-8">
          {showMyPage ? (
            <MyPage user={user} onBack={() => setShowMyPage(false)} />
          ) : (
            renderPage()
          )}
        </div>
      </main>

      {!showMyPage && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
    </div>
  );
}