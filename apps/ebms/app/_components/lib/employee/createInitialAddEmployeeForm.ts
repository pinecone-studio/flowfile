import type { AddEmployeeFormData } from './types';

export const createInitialAddEmployeeForm = (): AddEmployeeFormData => {
  return {
    firstName: '',
    lastName: '',
    firstNameEng: '',
    lastNameEng: '',
    birthMonth: '',
    birthDay: '',
    email: '',
    employeeCode: '',
    department: '',
    branch: '',
    positionTitle: '',
    hireDate: '',
    annualVacationDays: '',
    kpiEligible: '',
    salaryFromCompany: '',
    status: '',
  };
};
