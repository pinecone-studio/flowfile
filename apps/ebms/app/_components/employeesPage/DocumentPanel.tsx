'use client';

import Image from 'next/image';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import DocumentCard from './DocumentCard';

const documents = [
  {
    id: 1,
    title: 'Quarterly Performance Report',
    type: 'Excel Spreadsheet',
    status: 'Completed',
    generated: '2026-03-10',
    storage: 'Cloud Storage / HR',
  },
  {
    id: 2,
    title: 'Employee Onboarding Package',
    type: 'PDF Document',
    status: 'Completed',
    generated: '2026-03-13',
    storage: 'Cloud Storage / HR',
  },
  {
    id: 3,
    title: 'Employee Handbook 2026',
    type: 'PDF Document',
    status: 'Pending',
    generated: '2026-03-08',
    storage: 'Cloud Storage / HR',
  },
  {
    id: 4,
    title: 'Payroll Summary',
    type: 'CSV File',
    status: 'Failed',
    generated: '2026-03-07',
    storage: 'Cloud Storage / HR',
  },
];

const statusStyles: Record<string, string> = {
  Completed: 'border border-emerald-200 bg-emerald-50 text-emerald-600',
  Pending: 'border border-amber-300 bg-amber-50 text-amber-600',
  Failed: 'border border-red-200 bg-red-50 text-red-600',
};

const orderedStatuses = ['Completed', 'Pending', 'Failed'];

const DocumentPanel = () => {
  const [openId, setOpenId] = useState<number | null>(2);

  return (
    <aside className="min-h-[818px] rounded-[10px] border border-[#c7cedd] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#111827]" strokeWidth={1.8} />
          <h2 className="text-[14px] font-semibold text-[#111827]">
            Document Results
          </h2>
        </div>

        <button
          type="button"
          className="h-[30px] rounded-[6px] border border-[#e3e5ea] bg-[#f8f8fa] px-4 text-[12px] font-medium text-[#c2c6cf]"
        >
          View All
        </button>
      </div>

      <div className="mb-4 mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/pro5.png"
            alt="Bilguundul.B"
            width={42}
            height={42}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <p className="text-[14px] font-medium text-[#111827]">
              Bilguundul.B
            </p>
            <p className="text-[12px] text-[#6b7280]">EMP-001</p>
          </div>
        </div>

        <p className="text-[13px] text-[#222833]">Chief Learning Officer</p>
      </div>

      <div className="space-y-4">
        {orderedStatuses.map((status) => {
          const docs = documents.filter((doc) => doc.status === status);
          if (docs.length === 0) return null;

          return (
            <div key={status} className="space-y-3">
              <span
                className={`inline-flex rounded-full px-3 py-[4px] text-[12px] font-medium ${statusStyles[status]}`}
              >
                {status}
              </span>

              {docs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  title={doc.title}
                  type={doc.type}
                  generated={doc.generated}
                  storage={doc.storage}
                  expanded={openId === doc.id}
                  onToggle={() =>
                    setOpenId((prev) => (prev === doc.id ? null : doc.id))
                  }
                />
              ))}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default DocumentPanel;
