import type { ActivityRow, DashboardStat } from './dashboard.types';

export const dashboardStats: DashboardStat[] = [
  {
    label: 'Failed Documents',
    value: 16,
  },
  {
    label: 'Pending Signatures',
    value: 16,
  },
];

export const recentDocuments: ActivityRow[] = [
  {
    employee: 'Narantsatsralt.B',
    event: 'Onboarding',
    time: '10:32',
    status: 'Pending',
  },
  {
    employee: 'Narantsatsralt.B',
    event: 'Promotion',
    time: '09:15',
    status: 'Failed',
  },
  {
    employee: 'Narantsatsralt.B',
    event: 'Onboarding',
    time: '08:45',
    status: 'Complete',
  },
  {
    employee: 'Narantsatsralt.B',
    event: 'Termination',
    time: '08:20',
    status: 'Processing',
  },
  {
    employee: 'Narantsatsralt.B',
    event: 'Transfer',
    time: '07:55',
    status: 'Complete',
  },
  {
    employee: 'Narantsatsralt.B',
    event: 'Salary Adjustment',
    time: '07:40',
    status: 'Complete',
  },
];

export const recentLifecycleEvents = [...recentDocuments];

export const activityStatusStyles: Record<ActivityRow['status'], string> = {
  Pending: 'bg-[#e8f4dd] text-[#6f8f4e]',
  Failed: 'bg-[#f5dfda] text-[#b46358]',
  Complete: 'bg-[#dff3e0] text-[#2f8a3f]',
  Processing: 'bg-[#d7eff7] text-[#2b9ab8]',
};
