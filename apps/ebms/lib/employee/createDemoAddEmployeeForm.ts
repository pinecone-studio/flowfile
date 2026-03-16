import type { AddEmployeeFormData } from './types';

export const createDemoAddEmployeeForm = (): AddEmployeeFormData => {
  return {
    firstName: 'Билгүүн',
    lastName: 'Дөлгөөн',
    firstNameEng: 'Bilguun',
    lastNameEng: 'Dulguun',
    birthMonth: '03',
    birthDay: '12',
    email: 'bilguun.dulguun@example.com',
    employeeCode: 'EMP-006',
    department: 'Human Resources',
    branch: 'Ulaanbaatar',
    positionTitle: 'HR Specialist',
    hireDate: '2025 / 03 / 12',
    annualVacationDays: '20',
    kpiEligible: 'YES',
    salaryFromCompany: 'YES',
    status: 'ACTIVE',
  };
};
