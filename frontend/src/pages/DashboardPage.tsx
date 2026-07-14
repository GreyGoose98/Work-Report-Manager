import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { DashboardSummary } from '../types/report';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await api.get<DashboardSummary>('/dashboard/summary');
      setSummary(response.data);
    })();
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  const cards = [
    { label: 'Total Reports', value: summary.total_reports },
    { label: 'Created Today', value: summary.reports_today },
    { label: 'This Week', value: summary.reports_this_week },
    { label: 'Pending', value: summary.pending_reports },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Link to="/reports/new" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
          Add Report
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="text-lg font-semibold">Recent Reports</h3>
        <div className="mt-3 space-y-2">
          {summary.recent_reports.map((item) => (
            <Link key={item.id} to={`/reports/${item.id}`} className="block rounded-lg border p-3 hover:bg-slate-50">
              <p className="font-medium">{item.activity_description}</p>
              <p className="text-xs text-slate-500">{item.report_date} - {item.status}</p>
            </Link>
          ))}
          {!summary.recent_reports.length && (
            <p className="text-sm text-slate-600">No reports available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
