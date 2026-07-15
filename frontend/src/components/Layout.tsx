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
    <div className="min-h-screen text-slate-900 md:pl-68">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 border-r border-white/10 bg-gradient-to-b from-violet-950 via-violet-900 to-fuchsia-950 px-5 py-5 text-white shadow-2xl md:flex md:flex-col">
        <h1 className="text-3xl font-bold leading-8 tracking-tight">Work Report Manager</h1>
        <p className="mt-3 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-slate-100">{user?.full_name}</p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Workspace</p>
        <nav className="mt-5 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-white text-violet-950 shadow-sm' : 'text-violet-100 hover:bg-white/10 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-auto rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-white/20"
        >
          Logout
        </button>
      </aside>

      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-3 py-3 md:gap-5 md:px-5 md:py-5">
        <header className="sticky top-3 z-20 rounded-[1.5rem] border border-white/60 bg-white/92 px-4 py-3 shadow-sm backdrop-blur md:top-4 md:px-5 md:py-3.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-700">Work Report Manager</p>
              <p className="mt-1 text-sm text-slate-600">Signed in as {user?.full_name}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 sm:block">{user?.role}</div>
              <button
                onClick={logout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="w-full pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-2 mb-2 flex rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur md:hidden">
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
