import type { WorkCategory, WorkPriority, WorkStatus } from '../types/report';

export const WORK_CATEGORIES: WorkCategory[] = [
  'Daily Work',
  'Customer Visit',
  'Trial',
  'Time Estimation',
  'Technical Support',
  'Service Support',
  'Internal Meeting',
  'Documentation',
  'Follow-up',
  'Other',
];

export const WORK_STATUSES: WorkStatus[] = [
  'Draft',
  'In Progress',
  'Completed',
  'Pending',
  'Waiting for Customer',
  'Waiting for Internal Support',
];

export const PRIORITIES: WorkPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
