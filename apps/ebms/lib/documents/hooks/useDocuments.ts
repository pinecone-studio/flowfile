import { useState, useMemo } from 'react';

export const useDocuments = () => {
  const [, setFilter] = useState({
    search: '',
    status: 'All',
    dateRange: 'all',
  });

  const documents = useMemo(() => {
    // Туршилтын дата
    return [
      {
        id: '1',
        title: 'Contract.pdf',
        status: 'Approved',
        createdAt: '2024-03-01',
        employeeId: 'emp1',
      },
      {
        id: '2',
        title: 'Report.docx',
        status: 'Pending',
        createdAt: '2024-03-10',
        employeeId: 'emp2',
      },
    ];
  }, []);

  const handleSearch = (search: string) =>
    setFilter((prev) => ({ ...prev, search }));
  const handleStatus = (status: string) =>
    setFilter((prev) => ({ ...prev, status }));
  const handleDate = (dateRange: string) =>
    setFilter((prev) => ({ ...prev, dateRange }));

  return { documents, handleSearch, handleStatus, handleDate };
};
