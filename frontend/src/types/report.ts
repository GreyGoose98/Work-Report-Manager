export type WorkCategory =
  | 'Daily Work'
  | 'Customer Visit'
  | 'Trial'
  | 'Time Estimation'
  | 'Technical Support'
  | 'Service Support'
  | 'Internal Meeting'
  | 'Documentation'
  | 'Follow-up'
  | 'Other';

export type WorkStatus =
  | 'Draft'
  | 'In Progress'
  | 'Completed'
  | 'Pending'
  | 'Waiting for Customer'
  | 'Waiting for Internal Support';

export type WorkPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type WorkReport = {
  id: number;
  report_date: string;
  work_category: WorkCategory;
  customer_name: string | null;
  project_name: string | null;
  location: string | null;
  machine_model: string | null;
  activity_description: string;
  status: WorkStatus;
  priority: WorkPriority;
  pending_actions: string | null;
  next_follow_up_date: string | null;
  remarks: string | null;
  attachment_count: number;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type ReportInput = Omit<
  WorkReport,
  'id' | 'attachment_count' | 'created_by' | 'created_at' | 'updated_at'
>;

export type ReportListResponse = {
  items: WorkReport[];
  total: number;
};

export type DashboardSummary = {
  total_reports: number;
  reports_today: number;
  reports_this_week: number;
  pending_reports: number;
  recent_reports: WorkReport[];
};

export type Attachment = {
  id: number;
  report_id: number;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
};
