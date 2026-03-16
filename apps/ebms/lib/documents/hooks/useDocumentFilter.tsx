// features/documents/hooks/useDocumentFilter.ts
import { useState } from 'react';
import { DocumentStatus } from '@/apps/ebms/lib/documents/types/document.types';

export const useDocumentFilter = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<DocumentStatus | undefined>();
  const [employeeId, setEmployeeId] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  return {
    filters: { search, status, employeeId, sort },
    actions: { setSearch, setStatus, setEmployeeId, setSort }
  };
};