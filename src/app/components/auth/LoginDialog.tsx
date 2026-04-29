import { useState } from 'react';
import { ArrowRight, Fingerprint, ShieldCheck, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { signIn } from '../../../../utils/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onForgotPassword: () => void;
}

export function LoginDialog({ open, onOpenChange, onForgotPassword }: LoginDialogProps) {
  const { handleLoginSuccess } = useAuth();
  const { t, language } = useLanguage();
  const isKorean = language === 'ko';

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { user: loggedInUser, error } = await signIn(loginData.email, loginData.password, rememberMe);
      if (error) {
        alert(error);
      } else if (loggedInUser) {
        handleLoginSuccess(loggedInUser);
        onOpenChange(false);
        setLoginData({ email: '', password: '' });
      }
    } catch {
      alert(t('auth.login_error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[100dvh] max-w-none translate-y-[-50%] rounded-none border-none bg-transparent p-0 shadow-none sm:h-auto sm:w-[min(94vw,980px)] sm:max-w-none sm:rounded-[34px]">
        <div className="apple-shell min-h-[100dvh] rounded-none border-none sm:min-h-0 sm:rounded-[34px]">
          <div className="grid min-h-[100dvh] lg:min-h-0 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#eef4ff,#f7fbff)] p-10 lg:flex lg:flex-col lg:justify-between">
              <div className="absolute left-[-18%] top-[-10%] h-72 w-72 rounded-full bg-blue-200/42 blur-3xl" />
              <div className="absolute bottom-[-18%] right-[-8%] h-80 w-80 rounded-full bg-cyan-200/34 blur-3xl" />

              <div className="relative">
                <span className="apple-chip">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure sign-in
                </span>
                <h2 className="mt-10 text-[4.3rem] font-black leading-[0.88] tracking-[-0.1em] text-foreground">
                  {isKorean ? 'Welcome\nBack.' : 'Welcome\nBack.'}
                </h2>
                <p className="mt-6 max-w-[22rem] text-lg leading-8 text-muted-foreground">
                  {isKorean
                    ? '이미지 없이도 자연스럽게 느껴지는 인증 경험을 위해, 텍스트와 레이어만으로 공간감을 만들었습니다.'
                    : 'Designed to feel polished even without photography, using soft layers and crisp typography only.'}
                </p>
              </div>

              <div className="relative grid gap-4">
                <div className="apple-soft-card p-5">
                  <p className="apple-kicker">Daily inspiration</p>
                  <p className="mt-3 text-2xl font-black tracking-[-0.06em] text-foreground">
                    {isKorean ? '작은 루틴이 가장 오래 갑니다.' : 'The smallest routine is the one that lasts.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="apple-soft-card p-5">
                    <p className="text-sm text-muted-foreground">Face ID feel</p>
                    <Fingerprint className="mt-6 h-7 w-7 text-primary" />
                  </div>
                  <div className="apple-soft-card p-5">
                    <p className="text-sm text-muted-foreground">Flow</p>
                    <Sparkles className="mt-6 h-7 w-7 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-[100dvh] flex-col justify-center px-6 py-8 sm:px-10 lg:min-h-0 lg:px-12 lg:py-12">
              <DialogHeader className="space-y-4 text-left">
                <div className="apple-kicker">{isKorean ? 'Fitin Auth' : 'Fitin Auth'}</div>
                <DialogTitle className="text-[clamp(3rem,10vw,4.8rem)] font-black leading-[0.88] tracking-[-0.09em] text-foreground">
                  {isKorean ? 'Welcome\nBack.' : 'Welcome\nBack.'}
                </DialogTitle>
                <DialogDescription className="max-w-[28rem] text-base leading-7 text-muted-foreground sm:text-lg">
                  {isKorean
                    ? '운동 여정을 계속하려면 계정 정보를 입력해 주세요.'
                    : 'Enter your credentials to continue your fitness journey.'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground" htmlFor="ld-email">
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="ld-email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="apple-input border-0"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground" htmlFor="ld-password">
                      {t('auth.password')}
                    </Label>
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                      disabled={loading}
                    >
                      {t('auth.forgot_password')}
                    </button>
                  </div>
                  <Input
                    id="ld-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="apple-input border-0"
                  />
                </div>

                <label className="flex items-center justify-between rounded-[22px] bg-white/70 px-4 py-4 text-sm text-muted-foreground shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                  <span>{t('auth.remember_me')}</span>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded"
                    disabled={loading}
                  />
                </label>

                <Button type="submit" className="apple-button h-15 w-full border-0 text-lg" disabled={loading}>
                  {loading ? t('common.loading') : isKorean ? 'Sign In' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-8 flex items-center justify-between gap-4 rounded-[26px] bg-white/72 px-5 py-4 text-sm text-muted-foreground shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                <span>{isKorean ? '아직 계정이 없나요?' : 'New to Fitin?'}</span>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="font-semibold text-primary transition-opacity hover:opacity-80"
                >
                  {isKorean ? 'Create Account' : 'Create Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
