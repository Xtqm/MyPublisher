import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/Layout.js';
import { HealthStatusCard } from './components/HealthStatusCard.js';
import { FileText, Calendar, Users, Sparkles } from 'lucide-react';

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Home Page
const IndexPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold tracking-wider uppercase mb-1">
          <Sparkles className="w-4 h-4" />
          <span>{t('pages.home.title')}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('pages.home.welcome')}</h2>
        <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
          {t('pages.home.description')}
        </p>
      </div>

      {/* Health Status Widget */}
      <HealthStatusCard />
    </div>
  );
};

// Reports Placeholder Page
const ReportsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('pages.reports.title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('pages.reports.description')}</p>
      </div>

      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-600 font-medium">{t('pages.reports.placeholder')}</p>
      </div>
    </div>
  );
};

// Schedules Placeholder Page
const SchedulesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('pages.schedules.title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('pages.schedules.description')}</p>
      </div>

      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-600 font-medium">{t('pages.schedules.placeholder')}</p>
      </div>
    </div>
  );
};

// Publishers Placeholder Page
const PublishersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('pages.publishers.title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('pages.publishers.description')}</p>
      </div>

      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
          <Users className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-600 font-medium">{t('pages.publishers.placeholder')}</p>
      </div>
    </div>
  );
};

// Routes definition
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const schedulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schedules',
  component: SchedulesPage,
});

const publishersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/publishers',
  component: PublishersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  reportsRoute,
  schedulesRoute,
  publishersRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
