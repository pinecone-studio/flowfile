export type FlowTone =
  | 'active'
  | 'inactive'
  | 'onboarding'
  | 'promotion'
  | 'role-change'
  | 'terminate'
  | 'pending'
  | 'warning'
  | 'success'
  | 'failed'
  | 'neutral';

export const sidebarUser = {
  name: 'Narantsatsralt.B',
  email: 'Narantsatsralt@nest.edu.mn',
  avatar: '/pro5.png',
};

export const employeeCards = [
  {
    id: 'emp-0042',
    href: '/employees/profile?employeeId=emp-0042',
    status: 'Active',
    statusTone: 'active' as const,
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: 'narantsatsralt@nest.edu.mn',
    latestAction: 'Onboarding',
    actionTone: 'onboarding' as const,
    latestDate: '(Jan 12, 2025)',
  },
  {
    id: 'emp-0043',
    href: '/employees/profile?employeeId=emp-0043',
    status: 'Active',
    statusTone: 'active' as const,
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: 'narantsatsralt@nest.edu.mn',
    latestAction: 'Role Change',
    actionTone: 'role-change' as const,
    latestDate: '(Jan 12, 2025)',
  },
  {
    id: 'emp-0044',
    href: '/employees/profile?employeeId=emp-0044',
    status: 'Active',
    statusTone: 'active' as const,
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: 'narantsatsralt@nest.edu.mn',
    latestAction: 'Promotion',
    actionTone: 'promotion' as const,
    latestDate: '(Jan 12, 2025)',
  },
  {
    id: 'emp-0045',
    href: '/employees/profile?employeeId=emp-0045',
    status: 'Inactive',
    statusTone: 'inactive' as const,
    image: '/image%205.svg',
    role: 'Engineering Manager',
    name: 'Narantsatsralt.B',
    email: 'narantsatsralt@nest.edu.mn',
    latestAction: 'Terminate',
    actionTone: 'terminate' as const,
    latestDate: '(Jan 12, 2025)',
  },
];

export const dashboardActions = [
  {
    id: 'dashboard-action-1',
    avatar: '/pro5.png',
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    action: 'Promotion',
    tone: 'promotion' as const,
    date: 'Mar 19, 12:50',
    state: 'Distributing...',
    progress: 55,
  },
  {
    id: 'dashboard-action-2',
    avatar: '/pro5.png',
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    action: 'Promotion',
    tone: 'promotion' as const,
    date: 'Mar 19, 12:50',
    state: 'Distributing...',
    progress: 55,
  },
  {
    id: 'dashboard-action-3',
    avatar: '/pro5.png',
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    action: 'Promotion',
    tone: 'promotion' as const,
    date: 'Mar 19, 12:50',
    state: 'Distributing...',
    progress: 55,
  },
];

export const dashboardDocuments = [
  {
    id: 'dashboard-document-1',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    status: 'Generated',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'dashboard-document-2',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    status: 'Generated',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'dashboard-document-3',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    status: 'Generated',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'dashboard-document-4',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    status: 'Generating...',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'dashboard-document-5',
    name: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    status: 'Failed',
    timestamp: 'Jun 15, 09:14',
  },
];

export const employeeDetail = {
  employeeCode: 'EMP-0042',
  name: 'Narantsatsralt.B',
  fullName: 'Narantsatsralt Bayarsaikhan',
  status: 'Active',
  statusTone: 'active' as const,
  image: '/image%205.svg',
  birthday: 'Jan 19, 1998',
  position: 'Engineering Manager',
  department: 'Engineering',
  yearsWorked: '<1 year',
  kpiEligible: 'Yes',
  paidByCompany: 'Yes',
  email: 'narantsatsralt@nest.edu.mn',
};

export const employeeActions = [
  {
    id: 'detail-action-1',
    date: 'Mar 19, 12:50',
    year: '2026',
    label: 'Promotion',
    tone: 'promotion' as const,
    state: 'Distributing...',
  },
  {
    id: 'detail-action-2',
    date: 'Sep 09, 16:56',
    year: '2025',
    label: 'Role Change',
    tone: 'role-change' as const,
    state: 'Complete!',
  },
  {
    id: 'detail-action-3',
    date: 'July 19, 13:43',
    year: '2025',
    label: 'Onboarding',
    tone: 'onboarding' as const,
    state: 'Complete!',
  },
];

export const employeeDocuments = [
  {
    id: 'detail-document-1',
    name: 'Salary Increase Notice',
    status: 'Generating...',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'detail-document-2',
    name: 'Salary Increase Notice',
    status: 'Failed',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'detail-document-3',
    name: 'Salary Increase Notice',
    status: 'Generated',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'detail-document-4',
    name: 'Salary Increase Notice',
    status: 'Generated',
    timestamp: 'Jun 15, 09:14',
  },
  {
    id: 'detail-document-5',
    name: 'Salary Increase Notice',
    status: 'Generated',
    timestamp: 'Jun 15, 09:14',
  },
];

export const generateDocumentOptions = [
  'Salary Increase Notice',
  'Document #2',
  'Document #3',
  'Document #4',
  'Document #5',
  '...',
];

export const documentCategories = [
  'All',
  'Onboarding 4',
  'Promotion 8',
  'Role Change 3',
  'Offboarding 2',
];

export const documentProgressSteps = [
  { label: 'Generate 4/4', status: 'Completed 09:08', tone: 'success' as const },
  {
    label: 'Employee Signed 4/4',
    status: 'Completed 09:10',
    tone: 'success' as const,
  },
  { label: 'HR Review 4/4', status: 'Completed 09:15', tone: 'success' as const },
  { label: 'Approval 3/4', status: 'Waiting...', tone: 'warning' as const },
  { label: 'Distribution 0/4', status: 'Waiting...', tone: 'neutral' as const },
];

export const documentGroups = [
  {
    id: 'doc-group-1',
    expanded: false,
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    date: 'Mar 19, 12:50',
    latestAction: 'Onboarding',
    state: 'Waiting HR Review...',
    documents: [],
  },
  {
    id: 'doc-group-2',
    expanded: true,
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    date: 'Mar 19, 12:50',
    latestAction: 'Onboarding',
    state: 'Waiting HR Review...',
    documents: [
      {
        id: 'doc-row-1',
        title: 'Employment Contract',
        status: 'Generating...',
        timestamp: '',
        missing: 'All Signed',
        missingTone: 'success' as const,
      },
      {
        id: 'doc-row-2',
        title: 'Probation Order',
        status: 'Generated',
        timestamp: 'Jun 15, 09:14',
        missing: 'Waiting HR Lead',
        missingTone: 'warning' as const,
      },
      {
        id: 'doc-row-3',
        title: 'Job Description',
        status: 'Generated',
        timestamp: 'Jun 15, 09:15',
        missing: 'Waiting HR Lead',
        missingTone: 'warning' as const,
      },
      {
        id: 'doc-row-4',
        title: 'Non-Disclosure Agreement',
        status: 'Canceled',
        timestamp: 'Jun 15, 09:17',
        missing: 'Waiting HR Lead',
        missingTone: 'warning' as const,
      },
    ],
  },
  {
    id: 'doc-group-3',
    expanded: false,
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    date: 'Mar 19, 12:50',
    latestAction: 'Onboarding',
    state: 'Waiting HR Review...',
    documents: [],
  },
  {
    id: 'doc-group-4',
    expanded: false,
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    date: 'Mar 19, 12:50',
    latestAction: 'Onboarding',
    state: 'Waiting HR Review...',
    documents: [],
  },
  {
    id: 'doc-group-5',
    expanded: false,
    employee: 'Narantsatsral.B',
    code: 'EMP-004',
    date: 'Mar 19, 12:50',
    latestAction: 'Onboarding',
    state: 'Waiting HR Review...',
    documents: [],
  },
];

export const sharedRecipients = ['/pro1.png', '/pro2.png', '/pro3.png'];

export const approvalDocuments = [
  {
    id: 'approval-row-1',
    employee: 'Narantsatsral.B',
    name: 'Salary Increase Notice',
    date: 'Jun 15, 2026',
    time: '09:14',
  },
];

export const triggerTableRows = [
  {
    id: 'trigger-row-1',
    document: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    latestAction: 'Promotion',
    tone: 'promotion' as const,
    date: 'Jun 15, 2026',
    missing: 'HR Lead, Dept Chief',
    missingTone: 'warning' as const,
    status: 'Generating...',
  },
  {
    id: 'trigger-row-2',
    document: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    latestAction: 'Promotion',
    tone: 'promotion' as const,
    date: 'Jun 15, 2026',
    missing: 'All Signed',
    missingTone: 'success' as const,
    status: 'Failed',
  },
  {
    id: 'trigger-row-3',
    document: 'Salary Increase Notice',
    employee: 'Narantsatsral.B',
    latestAction: 'Promotion',
    tone: 'promotion' as const,
    date: 'Jun 15, 2026',
    missing: 'All Signed',
    missingTone: 'success' as const,
    status: 'Canceled',
  },
];

export const triggerStatusOptions = ['Generating...', 'Failed', 'Canceled'];

export const completedActions = [
  'Download PDF',
  'Sign / Approve',
  'View Audit / History',
  'View Error',
  'Retry Generation',
  'Cancel Generation',
];

export const actionQueueItem = {
  label: 'Employment Contract',
  employee: 'Narantsatsralt.B',
  employeeCode: '(EMP-0042)',
  flow: 'Onboarding 1/4',
  state: 'Pending',
  waiting: 'HR Lead, Dept Chief',
  date: 'Mar 12, 2026',
  time: '09:15',
};

export const auditLogRows = [
  {
    id: 'audit-1',
    action: 'Salary Increase Notice',
    actor: 'HR Lead',
    status: 'Generated',
    when: 'Jun 15, 2026 09:14',
  },
  {
    id: 'audit-2',
    action: 'Salary Increase Notice',
    actor: 'Dept Chief',
    status: 'Signed',
    when: 'Jun 15, 2026 09:17',
  },
  {
    id: 'audit-3',
    action: 'Salary Increase Notice',
    actor: 'System',
    status: 'Distributed',
    when: 'Jun 15, 2026 09:20',
  },
];
