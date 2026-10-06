import { type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HealthResponseSchema, formatDateTime } from '@mypublisher/shared';
import { Activity, CheckCircle2, XCircle, RefreshCw, Database, Server, Clock } from 'lucide-react';

export const HealthStatusCard: FC = () => {
  const { t } = useTranslation();

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch('/api/v1/health');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      return HealthResponseSchema.parse(json);
    },
    refetchInterval: 30000,
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-slate-800 text-sm sm:text-base">{t('health.title')}</h2>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          title={t('common.refresh')}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
          <span className="hidden sm:inline">{t('common.refresh')}</span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-slate-500 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>{t('health.checking')}</span>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">{t('health.error')}</h3>
              <p className="text-xs text-red-600 mt-1">{(error as Error).message}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                {t('health.retry')}
              </button>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Status Summary Banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-medium text-emerald-900">{t('health.status')}:</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                {t('health.connected')}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Database className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">{t('health.database')}</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {data.database === 'connected'
                      ? t('health.dbConnected')
                      : t('health.dbDisconnected')}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Server className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">{t('health.version')}</div>
                  <div className="text-sm font-semibold text-slate-800">
                    v{data.version} ({data.environment})
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('health.lastChecked')}:</span>
              <span className="font-medium text-slate-600">{formatDateTime(data.timestamp)}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
