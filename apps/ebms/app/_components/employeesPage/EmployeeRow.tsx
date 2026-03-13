import Image from 'next/image';
import { SquarePen } from 'lucide-react';

const statusClassNames = {
  Active:
    'border border-[#a7e3b4] bg-[#dff7e4] text-[#15913f]',
  Inactive:
    'border border-[#c5c7cb] bg-[#f1f2f4] text-[#666d77]',
  Terminated:
    'border border-[#f2a4a4] bg-[#ffe3e3] text-[#d43232]',
  Pending:
    'border border-[#edd36b] bg-[#fff4cb] text-[#b88200]',
};

type EmployeeRowProps = {
  employeeName: string;
  employeeId: string;
  position: string;
  hireDate: string;
  latestAction: string;
  latestActionDate: string;
  status: keyof typeof statusClassNames;
  image: string;
};

const EmployeeRow = ({
  employeeName,
  employeeId,
  position,
  hireDate,
  latestAction,
  latestActionDate,
  status,
  image,
}: EmployeeRowProps) => {
  return (
    <tr className="border-t border-[#d7dce5]">
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-3">
          <Image
            src={image}
            alt={employeeName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="text-[14px] font-medium leading-5 text-[#111827]">
              {employeeName}
            </span>
            <span className="text-[12px] leading-4 text-[#6b7280]">
              {employeeId}
            </span>
          </div>
        </div>
      </td>

      <td className="px-2 py-2.5 text-[13px] text-[#222833]">{position}</td>
      <td className="px-2 py-2.5 text-[13px] text-[#222833]">{hireDate}</td>
      <td className="px-4 py-2.5 text-[13px] text-[#222833]">
        <div>{latestAction}</div>
        <div>({latestActionDate})</div>
      </td>
      <td className="px-4 py-2.5">
        <span
          className={`inline-flex min-w-[67px] items-center justify-center rounded-full px-3 py-[4px] text-[12px] font-medium ${statusClassNames[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#374151]"
        >
          <SquarePen className="h-4 w-4" strokeWidth={1.8} />
          <span className="underline underline-offset-2">Edit</span>
        </button>
      </td>
    </tr>
  );
};

export default EmployeeRow;
