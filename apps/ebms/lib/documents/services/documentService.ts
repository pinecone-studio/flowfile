import { EmployeeDoc, DocumentQuery } from '../types/document.types';

const mockDocuments: EmployeeDoc[] = [
  {
    id: '1',
    title: 'Employee Onboarding Package',
    employeeId: 'EMP001',
    employeeName: 'Bilguundul.B',
    status: 'completed',
    createdAt: '2026-03-13',
  },
  {
    id: '2',
    title: 'Employee Handbook 2026',
    employeeId: 'EMP002',
    employeeName: 'Bolor.E',
    status: 'pending',
    createdAt: '2026-03-11',
  },
  {
    id: '3',
    title: 'Payroll Summary',
    employeeId: 'EMP003',
    employeeName: 'Javkhlantugs.B',
    status: 'failed',
    createdAt: '2026-03-10',
  },
];

export const getDocuments = async (
  query: DocumentQuery,
): Promise<EmployeeDoc[]> => {
  const { search, status, employeeId, sort } = query;

  // Complexity-г хамгийн бага байлгахын тулд Array.every ашиглав
  const filtered = mockDocuments.filter((doc) => {
    const checks = [
      !search || doc.title.toLowerCase().includes(search.toLowerCase()),
      !status || doc.status === status,
      !employeeId || doc.employeeId === employeeId,
    ];
    return checks.every(Boolean);
  });

  return sortData(filtered, sort);
};

// Sort логикийг тусад нь салгаснаар үндсэн функцийн complexity багасна
const sortData = (data: EmployeeDoc[], sortOrder?: 'asc' | 'desc') => {
  if (!sortOrder) return data;

  return [...data].sort((a, b) => {
    const aT = new Date(a.createdAt).getTime();
    const bT = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? aT - bT : bT - aT;
  });
};