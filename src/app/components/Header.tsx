import { useState } from 'react';
import { Dumbbell, LogIn, UserPlus, Download, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../../../utils/supabase/client';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onLoginSuccess?: () => void;
}

export function Header({ user, onLogout, onLoginSuccess }: HeaderProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

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
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        console.error('로그인 에러:', error);
        alert(`로그인 실패: ${error.message}`);
      } else {
        setShowLoginDialog(false);
        setLoginData({ email: '', password: '' });
        // 로그인 성공 시 콜백 호출 (슬라이드 표시)
        onLoginSuccess?.();
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

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            name: signupData.name,
            university: signupData.university,
            gender: signupData.gender,
          },
        },
      });

      if (error) {
        console.error('회원가입 에러:', error);
        alert(`회원가입 실패: ${error.message}`);
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
    </>
  );
}