import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
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
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPw('');
    setNewPwConfirm('');
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Step 1 */}
        {step === 'email' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('auth.forgot_password')}</DialogTitle>
              <DialogDescription>{t('auth.enter_email_reset')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('auth.email')}</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {t(loading ? 'common.sending' : 'auth.send_code')}
                </Button>
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('auth.back_to_login')}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 2 */}
        {step === 'verify' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('auth.verify_code')}</DialogTitle>
              <DialogDescription>{t('auth.enter_code_sent').replace('{email}', email)}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('auth.verification_code')}</Label>
                <Input
                  type="text"
                  placeholder={language === 'ko' ? '인증 코드 6자리' : '6-digit code'}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {t(loading ? 'common.verifying' : 'common.confirm')}
              </Button>
            </form>
          </>
        )}

        {/* Step 3 */}
        {step === 'newpw' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('auth.new_password')}</DialogTitle>
              <DialogDescription>{t('auth.enter_new_password')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('auth.new_password')}</Label>
                <Input
                  type="password"
                  placeholder={language === 'ko' ? '최소 8자 이상' : 'Min. 8 characters'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('auth.password_confirm')}</Label>
                <Input
                  type="password"
                  placeholder={t('auth.password_confirm')}
                  value={newPwConfirm}
                  onChange={(e) => setNewPwConfirm(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {t(loading ? 'common.changing' : 'auth.reset_password')}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}