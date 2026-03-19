export type Tone =
  | 'promotion'
  | 'onboarding'
  | 'role-change'
  | 'terminate'
  | 'active'
  | 'inactive'
  | 'neutral'
  | 'success'
  | 'warning';

export interface SegmentTab {
  label: string;
  value: string;
  active?: boolean;
}

export interface DocumentRecord {
  id: string;
  name: string;
  employee: string;
  phase: string;
  phaseTone: Tone;
  date: string;
  missingSignatures: string;
  missingTone: Tone;
  recipients: string[];
  status: string;
}

export interface EmployeeCardRecord {
  id: string;
  status: string;
  statusTone: Tone;
  image: string;
  role: string;
  name: string;
  email: string;
  latestAction: string;
  actionTone: Tone;
  latestDate: string;
}

export interface ActionRecord {
  id: string;
  date: string;
  time: string;
  employee: string;
  phase: string;
  phaseTone: Tone;
  progress: number;
  progressLabel: string;
  waiting: string;
}

export const sidebarUser = {
  name: 'Narantsatsralt.B',
  email: 'Narantsatsralt.B@nest.edu.mn',
  avatar: '/pro5.png',
};

export const documentTabs: SegmentTab[] = [
  { label: 'All', value: 'all', active: true },
  { label: 'Onboarding 4', value: 'onboarding' },
  { label: 'Promotion 8', value: 'promotion' },
  { label: 'Role Change 3', value: 'role-change' },
  { label: 'Termination 2', value: 'termination' },
];

export const documentRecords: DocumentRecord[] = [
  {
    id: 'salary-promotion',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsralt.B',
    phase: 'Promotion',
    phaseTone: 'promotion',
    date: 'Jun 15, 2026',
    missingSignatures: 'HR Lead, Dept Chief',
    missingTone: 'warning',
    recipients: ['/pro1.png', '/pro2.png', '/pro3.png'],
    status: 'Generated',
  },
  {
    id: 'salary-onboarding',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsralt.B',
    phase: 'Onboarding',
    phaseTone: 'onboarding',
    date: 'Jun 15, 2026',
    missingSignatures: 'All Signed',
    missingTone: 'success',
    recipients: ['/pro1.png', '/pro2.png', '/pro3.png'],
    status: 'Failed',
  },
  {
    id: 'salary-role-change',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsralt.B',
    phase: 'Role Change',
    phaseTone: 'role-change',
    date: 'Jun 15, 2026',
    missingSignatures: 'All Signed',
    missingTone: 'success',
    recipients: ['/pro1.png', '/pro2.png', '/pro3.png'],
    status: 'Generating...',
  },
  {
    id: 'salary-termination',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsralt.B',
    phase: 'Terminate',
    phaseTone: 'terminate',
    date: 'Jun 15, 2026',
    missingSignatures: 'All Signed',
    missingTone: 'success',
    recipients: ['/pro1.png', '/pro2.png', '/pro3.png'],
    status: 'Generating...',
  },
];

export const employeeCards: EmployeeCardRecord[] = [
  {
    id: 'employee-onboarding',
    status: 'Active',
    statusTone: 'active',
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: 'Narantsatsralt.B@nest.edu.mn',
    latestAction: 'Onboarding',
    actionTone: 'onboarding',
    latestDate: '(Jan 12, 2025)',
  },
  {
    id: 'employee-role-change',
    status: 'Active',
    statusTone: 'active',
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: '25LU2156@nest.edu.mn',
    latestAction: 'Role Change',
    actionTone: 'role-change',
    latestDate: '(Jan 12, 2025)',
  },
  {
    id: 'employee-promotion',
    status: 'Inactive',
    statusTone: 'inactive',
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: 'narantsatsralt@nest.edu.mn',
    latestAction: 'Promotion',
    actionTone: 'promotion',
    latestDate: '(Jan 12, 2025)',
  },
  {
    id: 'employee-terminate',
    status: 'Active',
    statusTone: 'active',
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: 'narantsatsralt@nest.edu.mn',
    latestAction: 'Terminate',
    actionTone: 'terminate',
    latestDate: '(Jan 12, 2025)',
  },
];

export const actionTabs: SegmentTab[] = [
  { label: 'All', value: 'all', active: true },
  { label: 'Step 2', value: 'step-2' },
  { label: 'Employee 1', value: 'employee' },
  { label: 'HR 2', value: 'hr' },
  { label: 'Complete 26', value: 'complete' },
];

export const actionRecords: ActionRecord[] = [
  {
    id: 'step-1',
    date: 'Today',
    time: '09:30',
    employee: 'Narantsatsral.B',
    phase: 'Terminate',
    phaseTone: 'terminate',
    progress: 18,
    progressLabel: '',
    waiting: 'Step 1/5 - Generate',
  },
  {
    id: 'step-2',
    date: 'Today',
    time: '09:30',
    employee: 'Narantsatsral.B',
    phase: 'Terminate',
    phaseTone: 'terminate',
    progress: 32,
    progressLabel: 'Step 2/5',
    waiting: 'Employee Review',
  },
  {
    id: 'step-3',
    date: 'Today',
    time: '09:30',
    employee: 'Narantsatsral.B',
    phase: 'Terminate',
    phaseTone: 'terminate',
    progress: 52,
    progressLabel: 'Step 3/5',
    waiting: 'HR Review',
  },
  {
    id: 'step-4',
    date: 'Today',
    time: '09:30',
    employee: 'Narantsatsral.B',
    phase: 'Terminate',
    phaseTone: 'terminate',
    progress: 70,
    progressLabel: 'Step 4/5',
    waiting: 'Approvals',
  },
  {
    id: 'step-5',
    date: 'Today',
    time: '09:30',
    employee: 'Narantsatsral.B',
    phase: 'Terminate',
    phaseTone: 'terminate',
    progress: 84,
    progressLabel: 'Step 5/5',
    waiting: 'Distribution',
  },
  {
    id: 'step-6',
    date: 'Today',
    time: '09:30',
    employee: 'Narantsatsral.B',
    phase: 'Terminate',
    phaseTone: 'terminate',
    progress: 92,
    progressLabel: 'Completed!',
    waiting: '',
  },
];
