import { useState } from 'react';
import { Dumbbell, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

export function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    gender: '',
    password: '',
    passwordConfirm: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 회원가입 로직 (현재는 UI만)
    alert(`회원가입이 완료되었습니다!\n이름: ${formData.name}\n이메일: ${formData.email}`);
    window.close();
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
                onClick={() => window.close()}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                가입하기
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => window.close()}
                className="text-blue-600 hover:text-blue-700 hover:underline"
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
