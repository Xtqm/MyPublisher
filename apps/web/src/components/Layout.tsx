import { type FC, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Home, ClipboardList, Calendar, Users, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/reports', label: t('nav.reports'), icon: ClipboardList },
    { to: '/schedules', label: t('nav.schedules'), icon: Calendar },
    { to: '/publishers', label: t('nav.publishers'), icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">{t('app.name')}</h1>
            <p className="text-xs text-slate-500 leading-none hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            v0.1.0-alpha
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white p-4 gap-1 min-h-[calc(100vh-57px)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">
            Navegación
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  activeProps={{
                    className:
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-50 transition-colors',
                  }}
                  activeOptions={{ exact: item.to === '/' }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-4xl">{children}</main>
      </div>

      {/* Mobile Bottom Navigation (visible only on mobile) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1 flex justify-around items-center h-16 shadow-lg"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-900 transition-colors"
              activeProps={{
                className:
                  'flex flex-col items-center justify-center flex-1 py-1 text-blue-600 font-semibold transition-colors',
              }}
              activeOptions={{ exact: item.to === '/' }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
