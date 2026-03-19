export type DetailField = { label: string; value: string };

export type DetailActionItem = {
  id: string;
  date: string;
  year: string;
  label: string;
  state: string;
  width: string;
  tone: 'promotion' | 'role-change' | 'onboarding' | 'terminate';
};

export type DetailDocumentItem = {
  id: string;
  title: string;
  status: 'Generating...' | 'Failed' | 'Generated';
  date: string;
};

export type EmployeeProfile = {
  id: string;
  image: string;
  code: string;
  status: 'Active' | 'Inactive' | 'Terminated';
  name: string;
  fullName: string;
  role: string;
  email: string;
  personalInfo: DetailField[];
  workInfo: DetailField[];
  contactInfo: DetailField[];
  timeline: DetailActionItem[];
  documents: DetailDocumentItem[];
  generateOptions: string[];
};

function createFallbackProfile(input: {
  id: string;
  image: string;
  code: string;
  status: EmployeeProfile['status'];
  name: string;
  fullName: string;
  role: string;
  email: string;
  birth: string;
  department: string;
  yearsWorked: string;
}) {
  return {
    id: input.id,
    image: input.image,
    code: input.code,
    status: input.status,
    name: input.name,
    fullName: input.fullName,
    role: input.role,
    email: input.email,
    personalInfo: [
      { label: 'Full Name', value: input.fullName },
      { label: 'Birthday', value: input.birth },
    ],
    workInfo: [
      { label: 'Position', value: input.role },
      { label: 'Department', value: input.department },
      { label: 'Employee Code', value: input.code },
      { label: 'Years Worked', value: input.yearsWorked },
      { label: 'KPI Eligible', value: 'Yes' },
      { label: 'Paid by Company', value: 'Yes' },
    ],
    contactInfo: [{ label: 'Email', value: input.email }],
    timeline: [
      { id: `${input.id}-1`, date: 'Mar 19, 12:50', year: '2026', label: 'Promotion', state: 'Distributing...', width: '76%', tone: 'promotion' },
      { id: `${input.id}-2`, date: 'Sep 09, 16:56', year: '2025', label: 'Role Change', state: 'Complete!', width: '78%', tone: 'role-change' },
      { id: `${input.id}-3`, date: 'July 19, 13:43', year: '2025', label: 'Onboarding', state: 'Complete!', width: '72%', tone: 'onboarding' },
    ],
    documents: [
      { id: `${input.id}-doc-1`, title: 'Salary Increase Notice', status: 'Generating...', date: 'Jun 15, 09:14' },
      { id: `${input.id}-doc-2`, title: 'Salary Increase Notice', status: 'Failed', date: 'Jun 15, 09:14' },
      { id: `${input.id}-doc-3`, title: 'Salary Increase Notice', status: 'Generated', date: 'Jun 15, 09:14' },
    ],
    generateOptions: ['Salary Increase Notice', 'Document #2', 'Document #3', 'Document #4', 'Document #5', '...'],
  } satisfies EmployeeProfile;
}

export const employeeProfiles: Record<string, EmployeeProfile> = {
  'emp-001': createFallbackProfile({
    id: 'emp-001',
    image: '/pro5.png',
    code: 'EMP001',
    status: 'Active',
    name: 'Bat.B',
    fullName: 'Bat Bold',
    role: 'Junior Engineer',
    email: 'bat.bold@company.mn',
    birth: 'Apr 12, 1999',
    department: 'Engineering',
    yearsWorked: '<1 year',
  }),
  'emp-002': createFallbackProfile({
    id: 'emp-002',
    image: '/pro1.png',
    code: 'EMP002',
    status: 'Active',
    name: 'Saraa.E',
    fullName: 'Saraa Erdene',
    role: 'Mid HR Specialist',
    email: 'saraa.erdene@company.mn',
    birth: 'Aug 20, 1997',
    department: 'HR',
    yearsWorked: '1 year',
  }),
  'emp-003': createFallbackProfile({
    id: 'emp-003',
    image: '/pro2.png',
    code: 'EMP003',
    status: 'Active',
    name: 'Temuulen.G',
    fullName: 'Temuulen Gan',
    role: 'Senior Finance Specialist',
    email: 'temuulen.gan@company.mn',
    birth: 'Feb 14, 1995',
    department: 'Finance',
    yearsWorked: '2 years',
  }),
  'emp-004': createFallbackProfile({
    id: 'emp-004',
    image: '/pro3.png',
    code: 'EMP004',
    status: 'Active',
    name: 'Anu.M',
    fullName: 'Anu Munkh',
    role: 'Junior Operations Specialist',
    email: 'anu.munkh@company.mn',
    birth: 'Nov 05, 2000',
    department: 'Operations',
    yearsWorked: '<1 year',
  }),
  'emp-005': createFallbackProfile({
    id: 'emp-005',
    image: '/pro4.png',
    code: 'EMP005',
    status: 'Active',
    name: 'Bayraa.B',
    fullName: 'Bayraa Bb',
    role: 'Lead Engineer',
    email: 'spibb20@gmail.com',
    birth: 'Jun 30, 1993',
    department: 'Engineering',
    yearsWorked: '2+ years',
  }),
};

export function getEmployeeProfile(employeeId: string) {
  return employeeProfiles[employeeId] ?? null;
}
