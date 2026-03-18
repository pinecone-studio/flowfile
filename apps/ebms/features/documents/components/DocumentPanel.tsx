'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import { EmployeeDoc } from '../../../lib/documents/types/document.types';
import { getDocuments } from '../../../lib/documents/services/documentService';
import { DocumentCard } from './DocumentCard';

export const DocumentPanel = () => {
  const [allDocuments, setAllDocuments] = useState<EmployeeDoc[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    const result = await getDocuments({});
    setAllDocuments(result);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(
    () => ({
      all: allDocuments.length,
      onboarding: allDocuments.filter((d) => d.status === 'completed').length,
      promotion: allDocuments.filter((d) => d.status === 'pending').length,
      failed:
        allDocuments.length -
        allDocuments.filter(
          (d) => d.status === 'completed' || d.status === 'pending',
        ).length,
    }),
    [allDocuments],
  );

  // Complexity (9 -> 2) болгож бууруулсан логик
  const filteredDocuments = useMemo(() => {
    const term = search.toLowerCase();
    const tabStatus: Record<string, string> = {
      Onboarding: 'completed',
      Promotion: 'pending',
      Termination: 'failed',
    };

    return allDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(term) ||
        doc.employeeName.toLowerCase().includes(term);

      if (!matchesSearch) return false;
      if (activeTab === 'All') return true;

      return doc.status === tabStatus[activeTab];
    });
  }, [allDocuments, activeTab, search]);

  const TABS = [
    { name: 'All', count: stats.all },
    { name: 'Onboarding', count: stats.onboarding },
    { name: 'Promotion', count: stats.promotion },
    { name: 'Termination', count: stats.onboarding }, // Дизайн хадгалах үүднээс
  ];

  return (
    <div className="w-full overflow-y-auto hide-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            value={search}
            placeholder="Search Documents..."
            className="w-[450px] bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[13.5px] text-gray-200 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5 p-1 bg-black/20 rounded-xl border border-white/5">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2
                ${activeTab === tab.name ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {tab.name}
              <span
                className={`text-[11px] ${activeTab === tab.name ? 'text-blue-100' : 'text-gray-600'}`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border-white/5 bg-white/[0.03] backdrop-blur-2xl">
        <div className="grid grid-cols-[2fr,1.5fr,1fr,1fr,1.5fr,1fr,1.2fr,0.2fr] gap-4 px-8 py-4 bg-[#123878]/60 border-b border-white/5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          <span>Document Name</span>
          <span>Employee</span>
          <span>Latest Action</span>
          <span>Date</span>
          <span>Missing Signatures</span>
          <span>Sent To</span>
          <span>Status</span>
          <span />
        </div>

        <div className="flex flex-col">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="hover:bg-white/[0.05]">
              <DocumentCard document={doc} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
