import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { ReportListResponse } from '../types/report';
import { WORK_CATEGORIES, WORK_STATUSES } from '../utils/constants';

export function ReportListPage() {
  const [data, setData] = useState<ReportListResponse>({ items: [], total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    const response = await api.get<ReportListResponse>('/reports', {
      params: {
        search: search || undefined,
        status: status || undefined,
        work_category: workCategory || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      },
    });
    setData(response.data);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Work Reports</h2>
        <Link to="/reports/new" className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white">New</Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-12">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-4" placeholder="Search customer, project, machine, activity" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2">
          <option value="">All Status</option>
          {WORK_STATUSES.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select value={workCategory} onChange={(e) => setWorkCategory(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2">
          <option value="">All Categories</option>
          {WORK_CATEGORIES.map((option) => <option key={option}>{option}</option>)}
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" />
        <div className="flex flex-col gap-2 sm:flex-row md:col-span-12 md:justify-end">
          <button
            onClick={() => {
              setSearch('');
              setStatus('');
              setWorkCategory('');
              setStartDate('');
              setEndDate('');
            }}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Clear
          </button>
          <button onClick={() => void load()} className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white">Apply Filter</button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-white shadow md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.report_date}</td>
                <td className="px-3 py-2">{item.work_category}</td>
                <td className="px-3 py-2">{item.customer_name || '-'}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">
                  <Link to={`/reports/${item.id}`} className="text-blue-700">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 md:hidden">
        {data.items.map((item) => (
          <Link key={item.id} to={`/reports/${item.id}`} className="block rounded-xl border bg-white p-3 shadow">
            <p className="font-medium">{item.activity_description}</p>
            <p className="text-xs text-slate-500">{item.report_date} - {item.work_category}</p>
            <p className="mt-1 text-xs">{item.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
