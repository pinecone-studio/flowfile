import { createEmployeeCode } from './createEmployeeCode';
import type { AddEmployeeFormData } from './types';

export const createInitialAddEmployeeForm = (): AddEmployeeFormData => {
  return {
    firstName: '',
    lastName: '',
    firstNameEng: '',
    lastNameEng: '',
    email: '',
    employeeCode: createEmployeeCode(),
    department: '',
    branch: '',
    level: '',
    hireDate: '',
    status: 'ACTIVE',
  };
};