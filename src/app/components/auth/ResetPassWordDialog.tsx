import { useState } from 'react';
import { ArrowRight, KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
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
import { requestPasswordReset, verifyResetCode, resetPassword } from '../../../../utils/auth';
import { useLanguage } from '../../contexts/LanguageContext';

type Step = 'email' | 'verify' | 'newpw';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBackToLogin: () => void;
}

export function ResetPasswordDialog({ open, onOpenChange, onBackToLogin }: ResetPasswordDialogProps) {
  const { t, language } = useLanguage();
  const isKorean = language === 'ko';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPw('');
    setNewPwConfirm('');
  };

  const handleClose = (value: boolean) => {
    if (!value) resetState();
    onOpenChange(value);
  };

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { success, error } = await requestPasswordReset(email);
      if (success) {
        alert(t('auth.code_sent_check_email'));
        setStep('verify');
      } else {
        alert(error || t('auth.failed_to_send_code'));
      }
    } catch {
      alert(t('common.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { valid, error } = await verifyResetCode(email, code);
      if (valid) {
        setStep('newpw');
      } else {
        alert(error || t('auth.invalid_code'));
      }
    } catch {
      alert(t('common.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPw !== newPwConfirm) {
      alert(t('auth.passwords_dont_match'));
      return;
    }

    setLoading(true);
    try {
      const { success, error } = await resetPassword(email, code, newPw);
      if (success) {
        alert(t('auth.password_changed_success'));
        handleClose(false);
        onBackToLogin();
      } else {
        alert(error || t('auth.failed_to_change_password'));
      }
    } catch {
      alert(t('common.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const copy =
    step === 'email'
      ? {
          title: isKorean ? '비밀번호를 재설정할게요.' : 'Let’s reset your password.',
          description: t('auth.enter_email_reset'),
          icon: MailCheck,
        }
      : step === 'verify'
        ? {
            title: t('auth.verify_code'),
            description: t('auth.enter_code_sent').replace('{email}', email),
            icon: ShieldCheck,
          }
        : {
            title: t('auth.new_password'),
            description: t('auth.enter_new_password'),
            icon: KeyRound,
          };

  const Icon = copy.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[32px] border-none bg-transparent p-0 shadow-none sm:max-w-2xl">
        <div className="apple-shell">
          <div className="grid gap-0 md:grid-cols-[0.72fr_1.28fr]">
            <div className="relative hidden overflow-hidden bg-[linear-gradient(155deg,#eff5ff,#f9fbff)] p-8 md:block">
              <div className="absolute left-[-18%] top-[-8%] h-56 w-56 rounded-full bg-blue-200/38 blur-3xl" />
              <div className="absolute bottom-[-18%] right-[-6%] h-64 w-64 rounded-full bg-cyan-200/26 blur-3xl" />
              <div className="relative">
                <span className="apple-chip">
                  <Icon className="h-3.5 w-3.5" />
                  Recovery
                </span>
                <h2 className="mt-8 text-[3.3rem] font-black leading-[0.9] tracking-[-0.1em] text-foreground">
                  {copy.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">{copy.description}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-9">
              <DialogHeader className="space-y-3 text-left">
                <span className="apple-chip w-fit md:hidden">
                  <Icon className="h-3.5 w-3.5" />
                  Recovery
                </span>
                <DialogTitle className="text-[2.4rem] font-black leading-[0.95] tracking-[-0.08em] text-foreground md:text-[2.8rem]">
                  {copy.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-7 text-muted-foreground sm:text-base">
                  {copy.description}
                </DialogDescription>
              </DialogHeader>

              {step === 'email' && (
                <form onSubmit={handleSendCode} className="mt-8 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.email')}</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="apple-input border-0"
                      required
                    />
                  </div>

                  <Button type="submit" className="apple-button h-14 w-full border-0 text-base" disabled={loading}>
                    {loading ? t('common.sending') : t('auth.send_code')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full text-center text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                  >
                    {t('auth.back_to_login')}
                  </button>
                </form>
              )}

              {step === 'verify' && (
                <form onSubmit={handleVerifyCode} className="mt-8 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.verification_code')}</Label>
                    <Input
                      type="text"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      placeholder={isKorean ? '인증 코드 6자리' : '6-digit code'}
                      className="apple-input border-0"
                      required
                    />
                  </div>

                  <Button type="submit" className="apple-button h-14 w-full border-0 text-base" disabled={loading}>
                    {loading ? t('common.verifying') : t('common.confirm')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}

              {step === 'newpw' && (
                <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.new_password')}</Label>
                    <Input
                      type="password"
                      value={newPw}
                      onChange={(event) => setNewPw(event.target.value)}
                      placeholder={isKorean ? '최소 8자 이상' : 'Min. 8 characters'}
                      className="apple-input border-0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('auth.password_confirm')}</Label>
                    <Input
                      type="password"
                      value={newPwConfirm}
                      onChange={(event) => setNewPwConfirm(event.target.value)}
                      placeholder={t('auth.password_confirm')}
                      className="apple-input border-0"
                      required
                    />
                  </div>

                  <Button type="submit" className="apple-button h-14 w-full border-0 text-base" disabled={loading}>
                    {loading ? t('common.changing') : t('auth.reset_password')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
