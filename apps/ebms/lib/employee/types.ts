export type EmployeeStatus = '' | 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
export type BinaryChoice = '' | 'YES' | 'NO';

export type EmployeeCardStatus = 'Active' | 'Inactive' | 'Terminated';
export type EmployeeCardStatusTone = 'success' | 'neutral' | 'danger';

export type AddEmployeeFieldName =
  | 'firstName'
  | 'lastName'
  | 'firstNameEng'
  | 'lastNameEng'
  | 'birthMonth'
  | 'birthDay'
  | 'email'
  | 'employeeCode'
  | 'department'
  | 'branch'
  | 'positionTitle'
  | 'hireDate'
  | 'annualVacationDays'
  | 'kpiEligible'
  | 'salaryFromCompany'
  | 'status';

export type AddEmployeeFormData = {
  firstName: string;
  lastName: string;
  firstNameEng: string;
  lastNameEng: string;
  birthMonth: string;
  birthDay: string;
  email: string;
  employeeCode: string;
  department: string;
  branch: string;
  positionTitle: string;
  hireDate: string;
  annualVacationDays: string;
  kpiEligible: BinaryChoice;
  salaryFromCompany: BinaryChoice;
  status: EmployeeStatus;
};

export type AddEmployeeFormErrors = Partial<
  Record<AddEmployeeFieldName, string>
>;

export type EmployeeDto = {
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
  status: Exclude<EmployeeStatus, ''>;
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
};
