export type DocumentStatus = 'completed' | 'pending' | 'failed';

export interface EmployeeDoc {
  id: string;
  title: string;
  status: DocumentStatus;
  employeeName: string;
  employeeId: string;
  createdAt: string;
}

export interface DocumentQuery {
  search?: string;
  status?: DocumentStatus;
  employeeId?: string;
  sort?: 'asc' | 'desc';
}