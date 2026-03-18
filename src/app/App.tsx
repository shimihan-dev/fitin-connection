import { useState, useEffect } from 'react';
import { WorkoutGuide } from './components/WorkoutGuide';
import { RoutinePlanner } from './components/RoutinePlanner';
import { Progress } from './components/Progress';
import { Diet } from './components/Diet';
import { Board } from './components/Board';
import { MyPage } from './components/MyPage';
import { Header } from './components/Header';
import { SignupPage } from './components/SignupPage';
import { WelcomeSlides } from './components/WelcomeSlides';
import { OnboardingFlow } from './components/OnboardingFlow';
import { CompetitionPage } from './components/Competition/CompetitionPage';
import { HomePage } from './components/HomePage';
import { NotificationsPage } from './components/NotificationsPage';
import { Navigation } from './components/Navigation';
import { useLanguage } from './contexts/LanguageContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Button as UIButton } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { getCurrentUser, signOut, signIn, requestPasswordReset, verifyResetCode, resetPassword, User } from '../../utils/auth';

type Page = 'home' | 'workout' | 'routine' | 'progress' | 'diet' | 'competition' | 'board';

export default function App() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showDictionary, setShowDictionary] = useState(false);
  const [isSignupPage, setIsSignupPage] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; id?: string; profile_picture?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeSlides, setShowWelcomeSlides] = useState(false);

  // 로그인 폼 상태
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);

  // 비밀번호 찾기 상태
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

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
      alert(t('auth.login_error_occurred'));
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
    alert(t('auth.logged_out'));
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
        <span className="ml-3 text-sm text-muted-foreground">{t('common.loading')}</span>
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
              <DialogTitle>{t('common.login')}</DialogTitle>
              <DialogDescription>
                {t('auth.welcome_back')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{t('auth.email')}</Label>
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
                <Label htmlFor="login-password">{t('auth.password')}</Label>
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
              <div className="flex items-center justify-between">
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
                    {t('auth.remember_me')}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginDialog(false);
                    setShowForgotPassword(true);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-700 underline transition-colors"
                  disabled={loginLoading}
                >
                  {t('auth.forgot_password')}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <UIButton
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loginLoading}
                >
                  {loginLoading ? t('common.loading') : t('common.login')}
                </UIButton>
                <button
                  type="button"
                  onClick={() => setShowLoginDialog(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={loginLoading}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 비밀번호 찾기 - 1단계: 이메일 입력 */}
        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('auth.forgot_password')}</DialogTitle>
              <DialogDescription>
                {t('auth.enter_email_reset')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setResetLoading(true);
              try {
                const { success, error } = await requestPasswordReset(resetEmail);
                if (success) {
                  alert(t('auth.code_sent_check_email'));
                  setShowForgotPassword(false);
                  setShowVerifyCode(true);
                } else {
                  alert(error || t('auth.failed_to_send_code'));
                }
              } catch {
                alert(t('common.error_occurred'));
              } finally {
                setResetLoading(false);
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">{t('auth.email')}</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={resetLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <UIButton type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={resetLoading}>
                  {resetLoading ? t('common.sending') : t('auth.send_code')}
                </UIButton>
                <button type="button" onClick={() => { setShowForgotPassword(false); setShowLoginDialog(true); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('auth.back_to_login')}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 비밀번호 찾기 - 2단계: 인증 코드 확인 */}
        <Dialog open={showVerifyCode} onOpenChange={setShowVerifyCode}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('auth.verify_code')}</DialogTitle>
              <DialogDescription>
                {t('auth.enter_code_sent').replace('{email}', resetEmail)}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setResetLoading(true);
              try {
                const { valid, error } = await verifyResetCode(resetEmail, resetCode);
                if (valid) {
                  setShowVerifyCode(false);
                  setShowNewPassword(true);
                } else {
                  alert(error || t('auth.invalid_code'));
                }
              } catch {
                alert(t('common.error_occurred'));
              } finally {
                setResetLoading(false);
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-code">{t('auth.verification_code')}</Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="인증 코드 6자리"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                  disabled={resetLoading}
                />
              </div>
              <UIButton type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={resetLoading}>
                {resetLoading ? t('common.verifying') : t('common.confirm')}
              </UIButton>
            </form>
          </DialogContent>
        </Dialog>

        {/* 비밀번호 찾기 - 3단계: 새 비밀번호 설정 */}
        <Dialog open={showNewPassword} onOpenChange={setShowNewPassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>새 비밀번호 설정</DialogTitle>
              <DialogDescription>
                새로운 비밀번호를 입력해주세요. (최소 8자)
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword !== newPasswordConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
              }
              setResetLoading(true);
              try {
                const { success, error } = await resetPassword(resetEmail, resetCode, newPassword);
                if (success) {
                  alert('비밀번호가 성공적으로 변경되었습니다! 새 비밀번호로 로그인해주세요.');
                  setShowNewPassword(false);
                  setResetEmail(''); setResetCode(''); setNewPassword(''); setNewPasswordConfirm('');
                  setShowLoginDialog(true);
                } else {
                  alert(error || '비밀번호 변경에 실패했습니다.');
                }
              } catch {
                alert('오류가 발생했습니다.');
              } finally {
                setResetLoading(false);
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="최소 8자 이상"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={resetLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password-confirm">새 비밀번호 확인</Label>
                <Input
                  id="new-password-confirm"
                  type="password"
                  placeholder="비밀번호 확인"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                  disabled={resetLoading}
                />
              </div>
              <UIButton type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={resetLoading}>
                {resetLoading ? '변경 중...' : '비밀번호 변경'}
              </UIButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} onNavigate={setCurrentPage} />;
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
        return <HomePage user={user} onNavigate={setCurrentPage} />;
    }
  };

  const showBottomNav = currentPage !== 'home' && !showMyPage && !showNotifications;

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Welcome Slides - 로그인 성공 시 표시 */}
      {showWelcomeSlides && (
        <WelcomeSlides onComplete={handleWelcomeSlidesComplete} />
      )}

      <Header user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} onMyPageClick={() => setShowMyPage(true)} onNotificationsClick={() => { setShowNotifications(true); setShowMyPage(false); }} showBackButton={currentPage !== 'home' || showMyPage || showNotifications} onBack={() => { setCurrentPage('home'); setShowMyPage(false); setShowNotifications(false); }} />

      <main className={`flex-1 overflow-y-auto pt-16 scroll-smooth ${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {showNotifications ? (
            <NotificationsPage />
          ) : showMyPage ? (
            <MyPage user={user} onBack={() => setShowMyPage(false)} />
          ) : (
            renderPage()
          )}
        </div>
      </main>

      {/* 하단 네비게이션 - 서브 페이지에서만 표시 (모바일) */}
      {showBottomNav && (
        <div className="md:hidden">
          <Navigation currentPage={currentPage} onNavigate={(page) => { setCurrentPage(page); setShowMyPage(false); setShowNotifications(false); }} />
        </div>
      )}
    </div>
  );
}