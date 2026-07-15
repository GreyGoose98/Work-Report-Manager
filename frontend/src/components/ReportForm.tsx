import { useMemo, useState } from 'react';
import { WORK_STATUSES } from '../utils/constants';
import type { ReportInput, WorkReport } from '../types/report';

type Props = {
  initial?: WorkReport;
  onSubmit: (payload: ReportInput) => Promise<void>;
  submitting: boolean;
  error: string | null;
};

type VoiceRecognition = {
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

const defaultValue: ReportInput = {
  report_date: new Date().toISOString().slice(0, 10),
  work_category: '',
  customer_name: '',
  project_name: '',
  location: '',
  machine_model: '',
  activity_description: '',
  status: 'Draft',
  priority: 'Medium',
  pending_actions: '',
  next_follow_up_date: null,
  remarks: '',
};

export function ReportForm({ initial, onSubmit, submitting, error }: Props) {
  const [form, setForm] = useState<ReportInput>(
    initial
      ? {
          ...initial,
          customer_name: initial.customer_name || '',
          project_name: initial.project_name || '',
          location: initial.location || '',
          machine_model: initial.machine_model || '',
          work_category: initial.work_category || '',
          pending_actions: initial.pending_actions || '',
          remarks: initial.remarks || '',
        }
      : defaultValue,
  );
  const [voiceError, setVoiceError] = useState('');

  const speechApi = useMemo(() => {
    const anyWindow = window as Window & {
      webkitSpeechRecognition?: new () => VoiceRecognition;
      SpeechRecognition?: new () => VoiceRecognition;
    };
    return anyWindow.SpeechRecognition || anyWindow.webkitSpeechRecognition;
  }, []);

  const setField = (name: keyof ReportInput, value: string | null) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startVoiceInput = () => {
    if (!speechApi) {
      setVoiceError('Voice input is not supported on this browser. Please type manually.');
      return;
    }

    setVoiceError('');
    const recognition = new speechApi();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setField('activity_description', `${form.activity_description} ${transcript}`.trim());
    };
    recognition.onerror = () => {
      setVoiceError('Voice input failed. Please try again or type manually.');
    };
    recognition.start();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit({
          ...form,
          customer_name: form.customer_name || null,
          project_name: form.project_name || null,
          location: form.location || null,
          machine_model: form.machine_model || null,
          pending_actions: form.pending_actions || null,
          next_follow_up_date: form.next_follow_up_date || null,
          remarks: form.remarks || null,
        });
      }}
      className="space-y-6 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur md:p-7"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-500">Reports workspace</p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Add a new activity log</h3>
        <p className="mt-1 text-sm text-slate-500">Capture customer work, task progress, and reminder items in one structured entry.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">
          Date
          <input
            type="date"
            value={form.report_date}
            onChange={(e) => setField('report_date', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Customer Name
          <input
            placeholder="Enter customer name"
            value={form.customer_name || ''}
            onChange={(e) => setField('customer_name', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Duration
          <input
            placeholder="Example: 2h 30m"
            value={form.location || ''}
            onChange={(e) => setField('location', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">
          Category
          <input
            placeholder="Enter category manually"
            value={form.work_category}
            onChange={(e) => setField('work_category', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Subcategory
          <input
            placeholder="Enter subcategory manually"
            value={form.project_name || ''}
            onChange={(e) => setField('project_name', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Status
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
            {WORK_STATUSES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-slate-700">Task</label>
          <button
            type="button"
            onClick={startVoiceInput}
            className="shrink-0 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Use Voice Input
          </button>
        </div>
        <textarea
          value={form.activity_description}
          onChange={(e) => setField('activity_description', e.target.value)}
          className="h-36 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          required
        />
        {voiceError && <p className="mt-1 text-xs text-amber-700">{voiceError}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Reminder Items
          <textarea
            placeholder="List pending or WIP follow-ups"
            value={form.pending_actions || ''}
            onChange={(e) => setField('pending_actions', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Remark
          <textarea
            placeholder="Add blockers, outcomes, or next-step notes"
            value={form.remarks || ''}
            onChange={(e) => setField('remarks', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">
          Reminder Tag
          <input
            placeholder="Example: Follow-up / Escalation"
            value={form.machine_model || ''}
            onChange={(e) => setField('machine_model', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Follow-up Date
          <input
            type="date"
            value={form.next_follow_up_date || ''}
            onChange={(e) => setField('next_follow_up_date', e.target.value || null)}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Priority lane
          <select value={form.priority} onChange={(e) => setField('priority', e.target.value as ReportInput['priority'])} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-rose-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-600 disabled:opacity-60 md:w-auto"
      >
        {submitting ? 'Saving...' : 'Save Report'}
      </button>
    </form>
  );
}
