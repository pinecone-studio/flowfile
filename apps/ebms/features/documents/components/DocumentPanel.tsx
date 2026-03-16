'use client';

import { useState, useEffect } from 'react';
import {
  EmployeeDoc,
  DocumentStatus,
} from '@/apps/ebms/lib/documents/types/document.types';
import { getDocuments } from '@/lib/documents/services/documentService';
import { DocumentCard } from './DocumentCard';

export const DocumentPanel = () => {
  const [documents, setDocuments] = useState<EmployeeDoc[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<DocumentStatus | ''>('');
  const [employeeId, setEmployeeId] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  // Шүүлтүүрүүд өөрчлөгдөх бүрд датаг дахин татах
  useEffect(() => {
    const fetchData = async () => {
      const result = await getDocuments({
        search,
        status: status === '' ? undefined : status,
        employeeId: employeeId === '' ? undefined : employeeId,
        sort,
      });
      setDocuments(result);
    };

    fetchData();
  }, [search, status, employeeId, sort]);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <input
          placeholder="Search by title..."
          className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg bg-white outline-none"
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          <option value="">All Employees</option>
          <option value="EMP001">Bilguundul.B</option>
          <option value="EMP002">Bolor.E</option>
          <option value="EMP003">Javkhlantugs.B</option>
        </select>

        <select
          className="border p-2 rounded-lg bg-white outline-none"
          onChange={(e) => setStatus(e.target.value as DocumentStatus)}
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          className="border p-2 rounded-lg bg-white outline-none"
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* List Section */}
      <div className="space-y-3">
        {documents.length > 0 ? (
          documents.map((doc) => <DocumentCard key={doc.id} document={doc} />)
        ) : (
          <div className="text-center py-12 text-gray-400 border border-dashed rounded-lg bg-white">
            Нийлцтэй баримт олдсонгүй.
          </div>
        )}
      </div>
    </div>
  );
};
