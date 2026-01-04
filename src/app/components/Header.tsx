import { useState } from 'react';
import { Dumbbell, LogIn, UserPlus, Download, Menu, X, User, LogOut, UserMinus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { signIn, signUp, isValidEmail, User as AuthUser, requestPasswordReset, verifyResetCode, resetPassword, deleteAccount } from '../../../utils/auth';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onLoginSuccess?: (user: AuthUser) => void;
}

export function Header({ user, onLogout, onLoginSuccess }: HeaderProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // 비밀번호 찾기 관련 상태
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [showVerifyCodeDialog, setShowVerifyCodeDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // 회원 탈퇴 관련 상태
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    university: '',
    gender: '',
    password: '',
    passwordConfirm: '',
    referralId: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user: loggedInUser, error } = await signIn(loginData.email, loginData.password);

      if (error) {
        alert(error);
      } else if (loggedInUser) {
        setShowLoginDialog(false);
        setLoginData({ email: '', password: '' });
        // 로그인 성공 시 콜백 호출 (사용자 정보 전달)
        onLoginSuccess?.(loggedInUser);
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (signupData.password.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (!isValidEmail(signupData.email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);

    try {
      const { user: newUser, error } = await signUp({
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        university: signupData.university,
        gender: signupData.gender,
        referralId: signupData.referralId,
      });

      if (error) {
        alert(error);
      } else {
        alert('회원가입 성공! 이제 로그인해주세요.');
        setShowSignupDialog(false);
        setShowLoginDialog(true);

        // 폼 초기화
        setSignupData({
          name: '',
          email: '',
          university: '',
          gender: '',
          password: '',
          passwordConfirm: '',
          referralId: '',
        });
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAppDownload = () => {
    alert('앱 다운로드 기능은 준비 중입니다!\niOS와 Android 버전이 곧 출시됩니다.');
  };

  // 비밀번호 찾기 - 1단계: 이메일로 인증 코드 요청
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { success, error } = await requestPasswordReset(resetEmail);

      if (error) {
        alert(error);
      } else if (success) {
        alert('인증 코드가 발송되었습니다.\n이메일을 확인해주세요.\n\n(테스트: 브라우저 콘솔에서 코드를 확인할 수 있습니다)');
        setShowForgotPasswordDialog(false);
        setShowVerifyCodeDialog(true);
      }
    } catch (error) {
      console.error('비밀번호 찾기 에러:', error);
      alert('인증 코드 발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 찾기 - 2단계: 인증 코드 확인
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { valid, error } = await verifyResetCode(resetEmail, resetCode);

      if (error) {
        alert(error);
      } else if (valid) {
        setShowVerifyCodeDialog(false);
        setShowResetPasswordDialog(true);
      }
    } catch (error) {
      console.error('인증 코드 확인 에러:', error);
      alert('인증 코드 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 찾기 - 3단계: 새 비밀번호 설정
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== newPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const { success, error } = await resetPassword(resetEmail, resetCode, newPassword);

      if (error) {
        alert(error);
      } else if (success) {
        alert('비밀번호가 성공적으로 변경되었습니다.\n새 비밀번호로 로그인해주세요.');

        // 상태 초기화
        setShowResetPasswordDialog(false);
        setShowLoginDialog(true);
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setNewPasswordConfirm('');
      }
    } catch (error) {
      console.error('비밀번호 재설정 에러:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg">IGC Fitness</h1>
                <p className="text-xs text-gray-500 hidden sm:block">대학생 피트니스 가이드</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{user.name}님</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={onLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteAccountDialog(true)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserMinus className="w-4 h-4" />
                    회원탈퇴
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowLoginDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    로그인
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSignupDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    회원가입
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{user.name}님</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowDeleteAccountDialog(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserMinus className="w-4 h-4" />
                    회원탈퇴
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowLoginDialog(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    로그인
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowSignupDialog(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    회원가입
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>
              IGC Fitness에 오신 것을 환영합니다!
            </DialogDescription>
          </DialogHeader>

          {/* Email/Password Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginDialog(false);
                  setShowSignupDialog(true);
                }}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                disabled={loading}
              >
                계정이 없으신가요? 회원가입
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginDialog(false);
                  setShowForgotPasswordDialog(true);
                  setResetEmail(loginData.email); // 이미 입력한 이메일 전달
                }}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                disabled={loading}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">IGC Fitness 회원가입</DialogTitle>
            <DialogDescription>
              건강한 대학생활을 함께 시작하세요!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="signup-name">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                />
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label htmlFor="signup-gender">
                  성별 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="signup-gender"
                  name="gender"
                  value={signupData.gender}
                  onChange={handleSignupChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                  <option value="prefer-not">선택하지 않음</option>
                </select>
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="signup-email">
                이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={signupData.email}
                onChange={handleSignupChange}
                required
                disabled={loading}
              />
            </div>

            {/* 대학교 */}
            <div className="space-y-2">
              <Label htmlFor="signup-university">
                대학교 <span className="text-red-500">*</span>
              </Label>
              <select
                id="signup-university"
                name="university"
                value={signupData.university}
                onChange={handleSignupChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">선택하세요</option>
                <option value="utah">University of Utah (유타대학교)</option>
                <option value="stonybrook">Stony Brook University (스토니브룩)</option>
                <option value="fit">Fashion Institute of Technology (FIT)</option>
                <option value="ghent">Ghent University (겐트대학교)</option>
                <option value="gmu">George Mason University (조지메이슨)</option>
              </select>
            </div>

            {/* 추천인 ID */}
            <div className="space-y-2">
              <Label htmlFor="signup-referral">
                추천인 ID <span className="text-gray-400">(선택)</span>
              </Label>
              <Input
                id="signup-referral"
                name="referralId"
                type="text"
                placeholder="추천인의 이메일 또는 ID"
                value={signupData.referralId}
                onChange={handleSignupChange}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">추천인이 있다면 입력해주세요</p>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="signup-password">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="8자 이상 입력하세요"
                value={signupData.password}
                onChange={handleSignupChange}
                minLength={8}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">최소 8자 이상</p>
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="signup-password-confirm">
                비밀번호 확인 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signup-password-confirm"
                name="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={signupData.passwordConfirm}
                onChange={handleSignupChange}
                minLength={8}
                required
                disabled={loading}
              />
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1"
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  <span className="text-red-500">*</span> 이용약관 및 개인정보처리방침에 동의합니다.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="marketing"
                  className="mt-1"
                  disabled={loading}
                />
                <label htmlFor="marketing" className="text-sm text-gray-700">
                  (선택) 마케팅 정보 수신에 동의합니다.
                </label>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSignupDialog(false)}
                className="flex-1"
                disabled={loading}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={loading}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? '가입 중...' : '가입하기'}
              </Button>
            </div>

            {/* 로그인 링크 */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSignupDialog(false);
                  setShowLoginDialog(true);
                }}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                disabled={loading}
              >
                이미 계정이 있으신가요? 로그인
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog - Step 1: Email Input */}
      <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>비밀번호 찾기</DialogTitle>
            <DialogDescription>
              가입하신 이메일 주소를 입력해주세요.
              인증 코드를 발송해드립니다.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">이메일</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? '발송 중...' : '인증 코드 발송'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPasswordDialog(false);
                  setShowLoginDialog(true);
                }}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                disabled={loading}
              >
                로그인으로 돌아가기
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Verify Code Dialog - Step 2: Code Input */}
      <Dialog open={showVerifyCodeDialog} onOpenChange={setShowVerifyCodeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>인증 코드 확인</DialogTitle>
            <DialogDescription>
              {resetEmail}로 발송된 6자리 인증 코드를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-code">인증 코드</Label>
              <Input
                id="reset-code"
                type="text"
                placeholder="123456"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                disabled={loading}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading || resetCode.length !== 6}
              >
                {loading ? '확인 중...' : '확인'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowVerifyCodeDialog(false);
                  setShowForgotPasswordDialog(true);
                }}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                disabled={loading}
              >
                인증 코드 다시 받기
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog - Step 3: New Password */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새 비밀번호 설정</DialogTitle>
            <DialogDescription>
              사용하실 새 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-gray-500">최소 8자 이상</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password-confirm">비밀번호 확인</Label>
              <Input
                id="new-password-confirm"
                type="password"
                placeholder="••••••••"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading || newPassword.length < 8}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">회원 탈퇴</DialogTitle>
            <DialogDescription>
              정말 탈퇴하시겠습니까? 탈퇴 후에는 로그인이 불가능합니다.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!user) return;

            setLoading(true);
            try {
              const { success, error } = await deleteAccount(user.email, deletePassword);

              if (error) {
                alert(error);
              } else if (success) {
                alert('회원 탈퇴가 완료되었습니다.\n이용해 주셔서 감사합니다.');
                setShowDeleteAccountDialog(false);
                setDeletePassword('');
                onLogout();
              }
            } catch (err) {
              console.error('회원 탈퇴 에러:', err);
              alert('회원 탈퇴 중 오류가 발생했습니다.');
            } finally {
              setLoading(false);
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-password">비밀번호 확인</Label>
              <Input
                id="delete-password"
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteAccountDialog(false);
                  setDeletePassword('');
                }}
                className="flex-1"
                disabled={loading}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={loading || !deletePassword}
              >
                <UserMinus className="w-4 h-4 mr-2" />
                {loading ? '탈퇴 중...' : '탈퇴하기'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}