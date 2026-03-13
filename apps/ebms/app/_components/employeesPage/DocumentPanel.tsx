// "use client"

// import { useState } from "react";
// import DocumentCard from "./DocumentCard";

// const documents = [
//   {
//     id: 1,
//     title: "Quarterly Performance Report",
//     type: "Excel Spreadsheet",
//     status: "Completed",
//     generated: "2026-03-10",
//     storage: "Cloud Storage / HR",
//   },
//   {
//     id: 2,
//     title: "Employee Onboarding Package",
//     type: "PDF Document",
//     status: "Completed",
//     generated: "2026-03-13",
//     storage: "Cloud Storage / HR",
//   },
//   {
//     id: 3,
//     title: "Employee Handbook 2026",
//     type: "PDF Document",
//     status: "Pending",
//     generated: "2026-03-08",
//     storage: "Cloud Storage / HR",
//   },
//   {
//     id: 4,
//     title: "Payroll Summary",
//     type: "CSV File",
//     status: "Failed",
//     generated: "2026-03-07",
//     storage: "Cloud Storage / HR",
//   },
// ];

// const statusStyles: Record<string, string> = {
//   Completed: "border border-emerald-200 bg-emerald-50 text-emerald-600",
//   Pending: "border border-amber-300 bg-amber-50 text-amber-600",
//   Failed: "border border-red-200 bg-red-50 text-red-600",
// };

// const groupedDocuments = Object.entries(
//   documents.reduce((acc, doc) => {
//     if (!acc[doc.status]) acc[doc.status] = [];
//     acc[doc.status].push(doc);
//     return acc;
//   }, {} as Record<string, typeof documents>)
// );

// const DocumentPanel = () => {
//   const [openId, setOpenId] = useState<number | null>(2);

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5">
//       <div className="mb-5 flex items-center justify-between">
//         <h2 className="text-lg font-semibold text-slate-900">
//           Document Results
//         </h2>
//         <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-300">
//           View All
//         </button>
//       </div>

//       <div className="mb-5 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <img
//             src="pro5.png"
//             alt="Bilguundul.B"
//             className="h-12 w-12 rounded-full object-cover"
//           />
//           <div>
//             <p className="text-sm font-medium text-slate-900">Bilguundul.B</p>
//             <p className="text-xs text-slate-400">EMP-001</p>
//           </div>
//         </div>
//         <p className="text-sm text-slate-700">Chief Learning Officer</p>
//       </div>

//       <div className="space-y-4">
//         {groupedDocuments.map(([status, docs]) => (
//           <div key={status} className="space-y-3">
//             <span
//               className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
//             >
//               {status}
//             </span>

//             {docs.map((doc) => (
//               <DocumentCard
//                 key={doc.id}
//                 title={doc.title}
//                 type={doc.type}
//                 generated={doc.generated}
//                 storage={doc.storage}
//                 expanded={openId === doc.id}
//                 onToggle={() => setOpenId((prev) => (prev === doc.id ? null : doc.id))} status={"Completed"}              />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DocumentPanel;

'use client';

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Document Results
        </h2>

        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-300"
        >
          View All
        </button>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="pro5.png"
            alt="Bilguundul.B"
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <p className="text-sm font-medium text-slate-900">Bilguundul.B</p>
            <p className="text-xs text-slate-400">EMP-001</p>
          </div>
        </div>

        <p className="text-sm text-slate-700">Chief Learning Officer</p>
      </div>

      <div className="space-y-4">
        {orderedStatuses.map((status) => {
          const docs = documents.filter((doc) => doc.status === status);
          if (docs.length === 0) return null;

          return (
            <div key={status} className="space-y-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
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
    </div>
  );
};

export default DocumentPanel;
