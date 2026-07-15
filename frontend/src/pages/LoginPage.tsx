import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PasswordField } from '../components/PasswordField';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../utils/apiError';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signupSuccess = Boolean(
    (location.state as { signupSuccess?: boolean } | null)?.signupSuccess,
  );

  const from = (location.state as { from?: string } | null)?.from || '/';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid username or password.'));
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
            <p className="mt-16 text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Welcome to your workspace</p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight">Hello! Have a productive day.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-violet-100/90">
              Capture daily updates, review team progress, and keep every work report in one clear place.
            </p>
          </div>
          <p className="text-sm text-violet-100/85">Built for focused teams and transparent progress</p>
        </section>

        <form onSubmit={onSubmit} className="flex w-full flex-col justify-center px-7 py-10 md:px-14">
          <div className="mx-auto w-full max-w-md space-y-5">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">Welcome back</h1>
              <p className="mt-3 text-sm text-slate-500">Sign in to manage your team&apos;s work reports.</p>
            </div>

            {signupSuccess && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Account created successfully. Please login.
              </p>
            )}

            <label className="block text-sm font-medium text-slate-700">
              Work email / username
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="name@company.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
              required
            />

            {error && <p className="text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-800 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="pt-6 text-center text-sm text-slate-500">
              New to WorkReport?{' '}
              <Link to="/register" className="font-semibold text-violet-700">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
