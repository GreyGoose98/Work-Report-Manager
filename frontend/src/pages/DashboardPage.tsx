import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { DashboardSummary, ReportListResponse, WorkReport } from '../types/report';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    void (async () => {
      const [summaryResponse, reportsResponse] = await Promise.all([
        api.get<DashboardSummary>('/dashboard/summary'),
        api.get<ReportListResponse>('/reports'),
      ]);
      setSummary(summaryResponse.data);
      setReports(reportsResponse.data.items);
    })();
  }, []);

  const sortedActivities = useMemo(() => {
    const priorityStatuses = ['Pending', 'In Progress'];
    return [...reports].sort((left, right) => {
      const leftPriority = priorityStatuses.includes(left.status) ? 0 : 1;
      const rightPriority = priorityStatuses.includes(right.status) ? 0 : 1;
      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }
      return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
    });
  }, [reports]);

  const latestActivities = sortedActivities.slice(0, showMore ? 20 : 5);
  const reminderItems = sortedActivities.filter((item) => ['Pending', 'In Progress'].includes(item.status)).slice(0, 6);

  if (!summary) return <p>Loading dashboard...</p>;

  const cards = [
    { label: 'Total Reports', value: summary.total_reports },
    { label: 'Created Today', value: summary.reports_today },
    { label: 'This Week', value: summary.reports_this_week },
    { label: 'Pending', value: summary.pending_reports },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-gradient-to-r from-violet-950 via-violet-900 to-fuchsia-900 p-7 text-white shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Dashboard</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">Latest activity and reminder overview</h2>
            <p className="mt-2 max-w-2xl text-sm text-violet-100/85">
              Review the latest 5 work items, expand to the most recent 20, and keep Pending or WIP reports visible at the top.
            </p>
          </div>
          <Link to="/reports/new" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-violet-900 shadow-sm transition hover:bg-violet-50">
            Add Report
          </Link>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Latest Activities</h3>
                <p className="mt-1 text-sm text-slate-500">Most recent reports ordered with Pending and WIP items first.</p>
              </div>
              {sortedActivities.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowMore((prev) => !prev)}
                  className="text-sm font-semibold text-violet-700"
                >
                  {showMore ? 'Show latest 5' : 'See more'}
                </button>
              )}
            </div>

            <div className="mt-4 space-y-3">
              {latestActivities.map((item) => (
                <Link key={item.id} to={`/reports/${item.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{item.customer_name || 'Internal activity'}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.activity_description}</p>
                    </div>
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{item.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{item.work_category}</span>
                    <span>{item.project_name || 'No subcategory'}</span>
                    <span>{item.report_date}</span>
                  </div>
                </Link>
              ))}
              {!latestActivities.length && <p className="text-sm text-slate-600">No activities available yet.</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
            <h3 className="text-xl font-semibold text-slate-900">Reminder Items</h3>
            <p className="mt-1 text-sm text-slate-500">Pending and WIP items are surfaced here for fast follow-up.</p>
            <div className="mt-4 space-y-3">
              {reminderItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{item.customer_name || 'Internal task'}</p>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.pending_actions || item.activity_description}</p>
                </div>
              ))}
              {!reminderItems.length && <p className="text-sm text-slate-600">No pending reminder items.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
            <h3 className="text-xl font-semibold text-slate-900">Status Summary</h3>
            <div className="mt-4 grid gap-3">
              {cards.map((card) => (
                <div key={card.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  <span className="text-slate-600">{card.label}</span>
                  <span className="font-semibold text-slate-900">{card.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
