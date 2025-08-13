'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user starts typing
    setSuccess(''); // Clear success message when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.name, formData.email, formData.password);
      }

      if (!result.success) {
        if (result.code === 'RATE_LIMIT') {
          setError('⚠️ ' + result.error);
        } else if (result.code === 'USER_EXISTS') {
          setError(result.error);
          // Automatically switch to login mode
          setTimeout(() => {
            setIsLogin(true);
            setError('');
          }, 3000);
        } else {
          setError(result.error);
        }
      } else {
        if (result.needsConfirmation) {
          setSuccess('✅ ' + result.message);
        } else if (result.needsLogin) {
          setSuccess('✅ ' + result.message);
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
          }, 2000);
        } else if (!isLogin) {
          setSuccess('✅ Account created successfully! You can now start using the app.');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-14 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-center text-lg font-medium">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </CardTitle>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-medium">
            <button
              type="button"
              className={`px-3 py-1.5 rounded-md transition ${
                isLogin
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-border)] text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]'
              }`}
              onClick={() => !isLogin && toggleMode()}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-md transition ${
                !isLogin
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-border)] text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]'
              }`}
              onClick={() => isLogin && toggleMode()}
            >
              Sign Up
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
              />
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              hint={isLogin ? undefined : 'Use 8+ characters'}
            />

            {(error || success) && (
              <div
                className={`text-xs rounded-md px-3 py-2 border flex items-start gap-2 leading-relaxed ${
                  error
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <span className="mt-0.5 text-sm">
                  {error ? '⚠️' : '✅'}
                </span>
                <span>{error || success}</span>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            <p className="text-[11px] text-center text-[var(--color-muted)]">
              {isLogin ? "Need an account? Switch above." : 'Already have an account? Switch above.'}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
