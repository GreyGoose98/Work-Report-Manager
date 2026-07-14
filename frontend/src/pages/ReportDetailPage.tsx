import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Attachment, WorkReport } from '../types/report';

export function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<WorkReport | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    const [reportResponse, attachmentResponse] = await Promise.all([
      api.get<WorkReport>(`/reports/${id}`),
      api.get<Attachment[]>(`/reports/${id}/attachments`),
    ]);
    setReport(reportResponse.data);
    setAttachments(attachmentResponse.data);
  };

  useEffect(() => {
    void load();
  }, [id]);

  const onDeleteReport = async () => {
    if (!confirm('Delete this report?')) return;
    await api.delete(`/reports/${id}`);
    navigate('/reports');
  };

  const onUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setError('');
    const formData = new FormData();
    formData.append('file', fileList[0]);
    try {
      await api.post(`/reports/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await load();
    } catch (e) {
      setError('Attachment upload failed. Allowed types: image, pdf, excel, word, text.');
    }
  };

  const onDeleteAttachment = async (attachmentId: number) => {
    await api.delete(`/attachments/${attachmentId}`);
    await load();
  };

  if (!report) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Work Report Detail</h2>
        <div className="flex gap-2">
          <Link to={`/reports/${id}/edit`} className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-white">Edit</Link>
          <button onClick={onDeleteReport} className="rounded bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <p><strong>Date:</strong> {report.report_date}</p>
        <p><strong>Category:</strong> {report.work_category}</p>
        <p><strong>Customer:</strong> {report.customer_name || '-'}</p>
        <p><strong>Project:</strong> {report.project_name || '-'}</p>
        <p><strong>Location:</strong> {report.location || '-'}</p>
        <p><strong>Machine:</strong> {report.machine_model || '-'}</p>
        <p><strong>Status:</strong> {report.status}</p>
        <p><strong>Priority:</strong> {report.priority}</p>
        <p><strong>Activity:</strong> {report.activity_description}</p>
        <p><strong>Pending Actions:</strong> {report.pending_actions || '-'}</p>
        <p><strong>Next Follow-up:</strong> {report.next_follow_up_date || '-'}</p>
        <p><strong>Remarks:</strong> {report.remarks || '-'}</p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="font-semibold">Attachments</h3>
        <input type="file" onChange={(e) => void onUpload(e.target.files)} className="mt-2" />
        {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
        <ul className="mt-3 space-y-2">
          {attachments.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded border p-2 text-sm">
              <span>{a.file_name} ({Math.round(a.file_size / 1024)} KB)</span>
              <button onClick={() => void onDeleteAttachment(a.id)} className="rounded bg-slate-800 px-2 py-1 text-xs text-white">Remove</button>
            </li>
          ))}
          {!attachments.length && <li className="text-sm text-slate-600">No attachments uploaded.</li>}
        </ul>
      </div>
    </div>
  );
}
