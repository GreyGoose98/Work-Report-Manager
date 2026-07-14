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
    <div>
      <h2 className="mb-4 text-2xl font-bold">Add Work Report</h2>
      <ReportForm onSubmit={onSubmit} submitting={submitting} error={error} />
    </div>
  );
}
