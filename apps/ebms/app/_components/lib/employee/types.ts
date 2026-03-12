export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export type AddEmployeeFieldName =
  | 'firstName'
  | 'lastName'
  | 'firstNameEng'
  | 'lastNameEng'
  | 'email'
  | 'employeeCode'
  | 'department'
  | 'branch'
  | 'level'
  | 'hireDate'
  | 'status';

export type AddEmployeeFormData = {
  firstName: string;
  lastName: string;
  firstNameEng: string;
  lastNameEng: string;
  email: string;
  employeeCode: string;
  department: string;
  branch: string;
  level: string;
  hireDate: string;
  status: EmployeeStatus;
};

export type AddEmployeeFormErrors = Partial<
  Record<AddEmployeeFieldName, string>
>;
