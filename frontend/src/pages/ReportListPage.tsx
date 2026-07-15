import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { ReportListResponse } from '../types/report';

export function ReportListPage() {
  const [data, setData] = useState<ReportListResponse>({ items: [], total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
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
    const items = subcategory
      ? response.data.items.filter((item) => item.project_name === subcategory)
      : response.data.items;
    setData({ ...response.data, items, total: items.length });
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-gradient-to-r from-violet-950 via-violet-900 to-fuchsia-900 p-7 text-white shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Reports</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">Track customer work and reminder items</h2>
            <p className="mt-2 max-w-2xl text-sm text-violet-100/85">
              Add new entries, filter the activity list, and keep Pending or WIP items visible for follow-up.
            </p>
          </div>
          <Link to="/reports/new" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-violet-900 shadow-sm transition hover:bg-violet-50">Add New Entry</Link>
        </div>
      </section>

      <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur md:grid-cols-12">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-4" placeholder="Search customer, project, machine, activity" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" placeholder="Status" />
        <input value={workCategory} onChange={(e) => setWorkCategory(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" placeholder="Category" />
        <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" placeholder="Subcategory" />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm md:col-span-2" />
        <div className="flex flex-col gap-2 sm:flex-row md:col-span-12 md:justify-end">
          <button
            onClick={() => {
              setSearch('');
              setStatus('');
              setWorkCategory('');
              setSubcategory('');
              setStartDate('');
              setEndDate('');
            }}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Clear
          </button>
          <button onClick={() => void load()} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">Apply Filter</button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/80">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Subcategory</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="px-3 py-2">{item.report_date}</td>
                <td className="px-3 py-2">{item.work_category}</td>
                <td className="px-3 py-2">{item.project_name || '-'}</td>
                <td className="px-3 py-2">{item.customer_name || '-'}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">
                  <Link to={`/reports/${item.id}`} className="font-medium text-blue-700">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 md:hidden">
        {data.items.map((item) => (
          <Link key={item.id} to={`/reports/${item.id}`} className="block rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="font-medium">{item.customer_name || 'Internal activity'}</p>
            <p className="mt-1 text-sm text-slate-600">{item.activity_description}</p>
            <p className="text-xs text-slate-500">{item.report_date} - {item.work_category} - {item.project_name || 'No subcategory'}</p>
            <p className="mt-1 text-xs">{item.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
