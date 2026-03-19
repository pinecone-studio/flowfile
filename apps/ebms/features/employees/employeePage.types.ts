import type { EmployeeCardRecord } from '../showcase/showcase.data';

export type EmployeeRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  imageUrl: string | null;
  hireDate: string | null;
  terminationDate: string | null;
  status: string;
  department: string | null;
  branch: string | null;
  employeeCode: string;
  level: string | null;
  updatedAt: string;
};

export type EmployeeFilters = {
  search: string;
  status: string;
  role: string;
  latestAction: string;
  department: string;
  branch: string;
  sortBy: string;
};

export type EmployeeQueryResponse = {
  data?: { employees?: EmployeeRecord[] };
  errors?: Array<{ message?: string }>;
};

export type EmployeePageData = {
  employeeCards: EmployeeCardRecord[];
  activeCount: number;
  inactiveCount: number;
};
