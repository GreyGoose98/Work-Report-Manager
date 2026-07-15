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
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/60 bg-gradient-to-r from-violet-950 via-violet-900 to-fuchsia-900 p-7 text-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Report detail</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">{report.customer_name || 'Internal activity'}</h2>
            <p className="mt-2 text-sm text-violet-100/85">Review task details, reminders, status, and attachments.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Link to={`/reports/${id}/edit`} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white">Edit</Link>
          <button onClick={onDeleteReport} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white">Delete</button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Date</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{report.report_date}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Status</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{report.status}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Category</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{report.work_category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Subcategory</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{report.project_name || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Duration</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{report.location || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Reminder Tag</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{report.machine_model || '-'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Task</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.activity_description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Reminder Items</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.pending_actions || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Remark</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{report.remarks || '-'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Attachments</h3>
          <p className="mt-1 text-sm text-slate-600">Upload documents, screenshots, and supporting files.</p>
          <input type="file" onChange={(e) => void onUpload(e.target.files)} className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
          {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
          <ul className="mt-4 space-y-2">
            {attachments.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
                <span>{a.file_name} ({Math.round(a.file_size / 1024)} KB)</span>
                <button onClick={() => void onDeleteAttachment(a.id)} className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Remove</button>
              </li>
            ))}
            {!attachments.length && <li className="text-sm text-slate-600">No attachments uploaded.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
