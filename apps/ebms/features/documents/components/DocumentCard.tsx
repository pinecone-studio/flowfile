

// 'use client';

// import { EmployeeDoc } from '../../../lib/documents/types/document.types';
// import { MoreHorizontal } from 'lucide-react';

// interface Props {
//   document: EmployeeDoc;
// }

// export const DocumentCard = ({ document }: Props) => {
//   return (
//     <div className="grid grid-cols-[2fr,1.5fr,1fr,1fr,1.5fr,1fr,1.2fr,0.2fr] items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-300 group border-b border-white/5">
//       {/* Document Name */}
//       <div className="flex flex-col min-w-0">
//         <span className="text-[14px] font-medium text-gray-200 group-hover:text-white transition-colors">
//           {document.title}
//         </span>
//       </div>

//       {/* Employee */}
//       <div className="flex flex-col">
//         <span className="text-[13.5px] text-gray-400 group-hover:text-gray-200 transition-colors">
//           {document.employeeName}
//         </span>
//       </div>

//       {/* Latest Action */}
//       <div>
//         <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/20">
//           Promotion
//         </span>
//       </div>

//       {/* Date */}
//       <div className="text-[13.5px] text-gray-400">
//         {document.createdAt || 'Jun 15, 2026'}
//       </div>

//       {/* Missing Signatures */}
//       <div className="flex items-center gap-2">
//         <div
//           className={`w-2 h-2 rounded-full ${
//             document.status === 'completed'
//               ? 'bg-green-500'
//               : 'bg-yellow-500 animate-pulse'
//           }`}
//         />
//         <span className="text-[13px] text-gray-400">
//           {document.status === 'completed'
//             ? 'All Signed'
//             : 'HR Lead, Dept Chief'}
//         </span>
//       </div>

//       {/* Sent To (Avatars) */}
//       <div className="flex -space-x-2 gap-3">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="w-7 h-7 rounded-full  border-[#0a1529] overflow-hidden transition-transform hover:translate-y-[-2px] hover:z-10 cursor-pointer"
//           >
//             <img
//               src={`https://i.pravatar.cc/100?u=${document.id}${i}`}
//               alt="avatar"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Status */}
//       <div className="text-[13px] text-gray-400 italic">
//         {document.status === 'completed'
//           ? 'Complete'
//           : document.status === 'pending'
//             ? 'Generating...'
//             : document.status === 'failed'
//               ? 'Failed'
//               : 'Canceled'}
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
//         <button className="text-gray-500 hover:text-white p-1.5 hover:bg-white/10 transition-all ">
//           <MoreHorizontal size={18} />
//         </button>
//       </div>
//     </div>
//   );
// };
