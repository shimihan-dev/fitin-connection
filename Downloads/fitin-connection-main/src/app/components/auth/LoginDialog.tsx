import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
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
  const { t } = useLanguage();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('common.login')}</DialogTitle>
          <DialogDescription>{t('auth.welcome_back')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ld-email">{t('auth.email')}</Label>
            <Input
              id="ld-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={loginData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ld-password">{t('auth.password')}</Label>
            <Input
              id="ld-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={loginData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded"
                disabled={loading}
              />
              {t('auth.remember_me')}
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-500 hover:text-blue-700 underline transition-colors"
              disabled={loading}
            >
              {t('auth.forgot_password')}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {t(loading ? 'common.loading' : 'common.login')}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}