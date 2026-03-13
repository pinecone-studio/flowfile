export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export interface Employee {
  id: string;
  entraId?: string | null;
  firstName: string;
  lastName: string;
  firstNameEng?: string | null;
  lastNameEng?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  hireDate?: string | null;
  numberOfVacationDays?: number | null;
  terminationDate?: string | null;
  status: EmployeeStatus;
  github?: string | null;
  department?: string | null;
  branch?: string | null;
  employeeCode: string;
  level?: string | null;
  isKpi: boolean;
  isSalaryCompany: boolean;
  birthDayAndMonth?: string | null;
  birthdayPoster?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  firstNameEng?: string;
  lastNameEng?: string;
  email?: string;
  hireDate?: string;
  status: EmployeeStatus;
  department?: string;
  branch?: string;
  employeeCode: string;
  level?: string;
  numberOfVacationDays?: number;
  isKpi?: boolean;
  isSalaryCompany?: boolean;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  firstNameEng?: string;
  lastNameEng?: string;
  email?: string;
  imageUrl?: string;
  hireDate?: string;
  numberOfVacationDays?: number;
  terminationDate?: string;
  status?: EmployeeStatus;
  github?: string;
  department?: string;
  branch?: string;
  level?: string;
  isKpi?: boolean;
  isSalaryCompany?: boolean;
  birthDayAndMonth?: string;
  birthdayPoster?: string;
}
