import { useAuth } from '../hooks/useAuth';

export function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-2xl font-bold">Profile</h2>
      <p className="mt-3"><strong>Full Name:</strong> {user?.full_name}</p>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      <p className="mt-4 text-sm text-slate-600">Future settings modules can be plugged in here.</p>
    </div>
  );
}
