import {
  EmployeeDoc, // Document биш EmployeeDoc болгож өөрчлөв
  DocumentQuery,
} from '../types/document.types';

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
  let data = [...mockDocuments];

  // Search filter
  if (query.search) {
    const value = query.search.toLowerCase();
    data = data.filter((doc) => doc.title.toLowerCase().includes(value));
  }

  // Status & Employee filter (Complexity багасгах үүднээс нэгтгэж болно)
  if (query.status) {
    data = data.filter((doc) => doc.status === query.status);
  }

  if (query.employeeId) {
    data = data.filter((doc) => doc.employeeId === query.employeeId);
  }

  // Sort logic (ESLint complexity: 4-т тааруулан авсаархан болгов)
  if (query.sort) {
    data.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return query.sort === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }

  return data;
};
