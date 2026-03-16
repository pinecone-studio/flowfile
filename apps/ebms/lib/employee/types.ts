export type EmployeeStatus = '' | 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
export type BinaryChoice = '' | 'YES' | 'NO';

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
