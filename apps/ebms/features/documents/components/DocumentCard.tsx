'use client';

import { EmployeeDoc } from '../../../lib/documents/types/document.types';
import { MoreHorizontal } from 'lucide-react';

interface Props {
  document: EmployeeDoc;
}

export const DocumentCard = ({ document }: Props) => {
  // 1. Complexity-г 1 болгохын тулд бүх зүйлийг объект дотор хадгалах
  const statusLabels: Record<string, string> = {
    completed: 'Complete',
    pending: 'Generating...',
    failed: 'Failed',
  };

  const dotClasses: Record<string, string> = {
    completed: 'bg-green-500',
    pending: 'bg-yellow-500 animate-pulse',
    failed: 'bg-red-500',
  };

  const signTexts: Record<string, string> = {
    completed: 'All Signed',
    pending: 'HR Lead, Dept Chief',
    failed: 'Action Required',
  };

  // 2. Ямар ч 'if' эсвэл '?' ашиглахгүйгээр утгуудыг шууд авна
  const currentStatus = statusLabels[document.status] || 'Canceled';
  const currentDotClass = dotClasses[document.status] || 'bg-gray-500';
  const currentSignText = signTexts[document.status] || 'Unknown';

  return (
    <div className="grid grid-cols-[2fr,1.5fr,1fr,1fr,1.5fr,1fr,1.2fr,0.2fr] items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-300 group border-b border-white/5">
      <div className="flex flex-col min-w-0">
        <span className="text-[14px] font-medium text-gray-200 group-hover:text-white transition-colors">
          {document.title}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[13.5px] text-gray-400 group-hover:text-gray-200 transition-colors">
          {document.employeeName}
        </span>
      </div>

      <div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/20">
          Promotion
        </span>
      </div>

      <div className="text-[13.5px] text-gray-400">
        {document.createdAt || 'Jun 15, 2026'}
      </div>

      {/* Энд ямар ч logic байхгүй, зөвхөн бэлэн хувьсагчдыг харуулна */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${currentDotClass}`} />
        <span className="text-[13px] text-gray-400">{currentSignText}</span>
      </div>

      <div className="flex -space-x-2 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-[#0a1529] overflow-hidden transition-transform hover:translate-y-[-2px] hover:z-10 cursor-pointer"
          >
            <img
              src={`https://i.pravatar.cc/100?u=${document.id}${i}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="text-[13px] text-gray-400 italic">{currentStatus}</div>

      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-500 hover:text-white p-1.5 hover:bg-white/10 transition-all">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
};
