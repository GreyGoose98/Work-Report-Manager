import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { api } from '../services/api';
import type { ReportInput, WorkReport } from '../types/report';

export function ReportEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<WorkReport | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await api.get<WorkReport>(`/reports/${id}`);
      setReport(response.data);
    })();
  }, [id]);

  const onSubmit = async (payload: ReportInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.put(`/reports/${id}`, payload);
      navigate(`/reports/${id}`);
    } catch {
      setError('Unable to update report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!report) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Edit Work Report</h2>
      <ReportForm initial={report} onSubmit={onSubmit} submitting={submitting} error={error} />
    </div>
  );
}
