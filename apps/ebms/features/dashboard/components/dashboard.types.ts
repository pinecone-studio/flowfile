export type DashboardStat = {
  label: string;
  value: number;
};

export type ActivityRow = {
  employee: string;
  event: string;
  time: string;
  status: 'Pending' | 'Failed' | 'Complete' | 'Processing';
};
