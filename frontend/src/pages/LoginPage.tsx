import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Work Report Manager</h1>
        <p className="mt-1 text-sm text-slate-600">Login to manage daily reports</p>

        {signupSuccess && (
          <p className="mt-3 text-sm text-emerald-700">
            Account created successfully. Please login.
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Username
          <input
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          New user?{' '}
          <Link to="/register" className="font-medium text-blue-700">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
