import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordField } from '../components/PasswordField';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { api } from '../services/api';
import type { RegisterPayload } from '../types/auth';
import { getApiErrorMessage } from '../utils/apiError';
import { isStrongPassword } from '../utils/passwordStrength';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>({
    username: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isStrongPassword(form.password)) {
      setError('Please meet all password strength requirements before signing up.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', form);
      navigate('/login', {
        replace: true,
        state: { signupSuccess: true },
      });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to create account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1fb] p-4 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden bg-gradient-to-br from-violet-900 via-violet-800 to-fuchsia-900 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-white" />
              <span className="text-xl font-bold">WorkReport</span>
            </div>
            <p className="mt-16 text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Create your workspace access</p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight">Build your reporting habit.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-violet-100/90">
              Set up your account, structure categories, and keep every work update flowing into one premium workspace.
            </p>
          </div>
          <p className="text-sm text-violet-100/85">Secure access to your organization workspace</p>
        </section>

        <form onSubmit={onSubmit} className="flex w-full flex-col justify-center px-7 py-10 md:px-14">
          <div className="mx-auto w-full max-w-md space-y-5">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">Create account</h1>
              <p className="mt-3 text-sm text-slate-500">Sign up to manage reports, reminders, and settings in one place.</p>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Your full name"
                value={form.full_name}
                onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Work email / username
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="name@company.com"
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                required
                minLength={3}
              />
            </label>
            <div>
              <PasswordField
                label="Password"
                value={form.password}
                onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
                placeholder="Create password"
                required
                minLength={8}
              />
              <PasswordStrengthMeter password={form.password} />
            </div>

            {error && <p className="text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-800 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="pt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-violet-700">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
