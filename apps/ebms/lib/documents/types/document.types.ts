export type DocumentStatus =
  | 'completed'
  | 'pending'
  | 'failed';
  
export interface Document {
  id: string;
  title: string;
  status: DocumentStatus;
  employeeName: string;
  employeeId: string;
  createdAt: string; // Энд үсгийн алдаа байгаа эсэхийг нягтлаарай (createdAtts?)
}

export interface DocumentQuery {
  search?: string;
  status?: DocumentStatus;
  employeeId?: string;
  sort?: 'asc' | 'desc';
}