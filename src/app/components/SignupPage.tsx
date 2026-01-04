import { useState } from 'react';
import { Dumbbell, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { signUp, isValidEmail } from '../../utils/auth';

interface SignupPageProps {
  onClose: () => void;
  onLoginClick?: () => void;
}

export function SignupPage({ onClose, onLoginClick }: SignupPageProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    gender: '',
    password: '',
    passwordConfirm: '',
    referrer: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        university: formData.university,
        gender: formData.gender,
        referrer: formData.referrer,
      });

      if (error) {
        alert(error);
      } else {
        alert('회원가입이 완료되었습니다!\n로그인해주세요.');
        onClose();
      }
    } catch (err) {
      console.error('Signup Error:', err);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2">IGC Fitness 회원가입</h1>
            <p className="text-gray-600">
              건강한 대학생활을 함께 시작하세요!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label htmlFor="gender">
                  성별 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </select>
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email">
                이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* 대학교 */}
            <div className="space-y-2">
              <Label htmlFor="university">
                대학교 <span className="text-red-500">*</span>
              </Label>
              <select
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
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
              <Label htmlFor="password">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="8자 이상 입력하세요"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">최소 8자 이상</p>
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">
                비밀번호 확인 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                minLength={8}
                required
                disabled={loading}
              />
            </div>

            {/* 추천인 */}
            <div className="space-y-2">
              <Label htmlFor="referrer">
                추천인 (선택)
              </Label>
              <Input
                id="referrer"
                name="referrer"
                type="text"
                placeholder="추천인의 이름을 입력하세요"
                value={formData.referrer}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                친구의 소개로 오셨나요? 추천인을 입력해주세요.
              </p>
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
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
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
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={onLoginClick}
                className="text-blue-600 hover:text-blue-700 hover:underline"
                type="button"
                disabled={loading}
              >
                로그인하기
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
