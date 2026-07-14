import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/reports', label: 'Reports' },
  { to: '/reports/new', label: 'Add Report' },
  { to: '/settings', label: 'Settings' },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="hidden min-h-screen w-64 bg-slate-900 p-4 text-white md:block">
          <h1 className="text-xl font-bold">Work Report Manager</h1>
          <p className="mt-1 text-sm text-slate-300">{user?.full_name}</p>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white text-slate-900' : 'hover:bg-slate-800'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-8 rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium"
          >
            Logout
          </button>
        </aside>

        <main className="w-full p-4 pb-20 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-slate-300 bg-white md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 px-2 py-3 text-center text-xs ${isActive ? 'font-semibold text-blue-700' : 'text-slate-600'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
