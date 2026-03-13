type EmployeeRowProps = {
  employeeName: string;
  employeeId: string;
  position: string;
  hireDate: string;
  latestAction: string;
  status: string;
  image: string;
};

const EmployeeRow = ({
  employeeName,
  employeeId,
  position,
  hireDate,
  latestAction,
  status,
  image,
}: EmployeeRowProps) => {
  return (
    <tr className="border-t border-slate-200">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={employeeName}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">
              {employeeName}
            </span>
            <span className="text-xs text-slate-500">{employeeId}</span>
          </div>
        </div>
      </td>

      <td className="px-2 py-4 text-sm ">{position}</td>
      <td className="px-2 py-4 text-sm ">{hireDate}</td>
      <td className="px-4 py-4 text-sm ">{latestAction}</td>
      <td className="px-4 py-4">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {status}
        </span>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-700">Edit</td>
    </tr>
  );
};

export default EmployeeRow;
