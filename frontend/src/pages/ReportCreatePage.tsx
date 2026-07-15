import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { api } from '../services/api';
import type { ReportInput } from '../types/report';

export function ReportCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (payload: ReportInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await api.post('/reports', payload);
      navigate(`/reports/${response.data.id}`);
    } catch {
      setError('Unable to save report. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/60 bg-gradient-to-r from-violet-950 via-violet-900 to-fuchsia-900 p-7 text-white shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Reports</p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight">Add a new work report</h2>
        <p className="mt-2 max-w-2xl text-sm text-violet-100/85">
          Log customer work, track duration, tag reminders, and keep your daily reporting structure consistent.
        </p>
      </section>
      <ReportForm onSubmit={onSubmit} submitting={submitting} error={error} />
    </div>
  );
}
