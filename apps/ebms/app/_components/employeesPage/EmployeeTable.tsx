import { UsersRound } from 'lucide-react';
import AddEmployeeDialog from '../employees/AddEmployeeDialog';
import EmployeeRow from './EmployeeRow';
import EmployeeSearch from './EmployeeSearch';

const employees = [
  {
    image: '/pro5.png',
    employeeId: 'EMP-001',
    employeeName: 'Bilguundul.B',
    position: 'Chief Learning Officer',
    hireDate: '2024-09-07',
    latestAction: 'change_position',
    latestActionDate: '2024-3-12',
    status: 'Active' as const,
  },
  {
    image: '/pro1.png',
    employeeId: 'EMP-002',
    employeeName: 'Bolor.E',
    position: 'Marketing Director',
    hireDate: '2023-09-07',
    latestAction: 'offboard_employee',
    latestActionDate: '2024-7-15',
    status: 'Inactive' as const,
  },
  {
    image: '/pro2.png',
    employeeId: 'EMP-003',
    employeeName: 'Javkhlantugs.B',
    position: 'Tech lead & SproutLab Director',
    hireDate: '2023-09-07',
    latestAction: 'change-position',
    latestActionDate: '2024-10-23',
    status: 'Active' as const,
  },
  {
    image: '/pro3.png',
    employeeId: 'EMP-004',
    employeeName: 'Narantsatsralt.B',
    position: 'Engineering Manager',
    hireDate: '2023-09-07',
    latestAction: 'change-position',
    latestActionDate: '2025-1-21',
    status: 'Terminated' as const,
  },
  {
    image: '/pro4.png',
    employeeId: 'EMP-005',
    employeeName: 'Munkhtulga.N',
    position: 'Product designer',
    hireDate: '2023-09-07',
    latestAction: 'add_employee',
    latestActionDate: '2025-3-11',
    status: 'Pending' as const,
  },
];

const EmployeeTable = () => {
  return (
    <section className="min-h-[818px] rounded-[10px] border border-[#c7cedd] bg-white p-[22px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-[#111827]" strokeWidth={1.8} />
          <h2 className="text-[14px] font-semibold text-[#111827]">
            Employee Management
          </h2>
        </div>

        <AddEmployeeDialog />
      </div>

      <div className="mb-3 mt-4">
        <EmployeeSearch />
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#c7cedd]">
        <table className="w-full border-collapse">
          <thead className="bg-[#dbe2f0]">
            <tr>
              <th className="px-3 py-3 text-left text-[12px] font-medium uppercase tracking-[0.12em] text-[#5f6877]">
                Employee
              </th>
              <th className="px-2 py-3 text-left text-[12px] font-medium uppercase tracking-[0.12em] text-[#5f6877]">
                Position
              </th>
              <th className="px-2 py-3 text-left text-[12px] font-medium uppercase tracking-[0.12em] text-[#5f6877]">
                Hire Date
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium uppercase tracking-[0.12em] text-[#5f6877]">
                Latest Action
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium uppercase tracking-[0.12em] text-[#5f6877]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium uppercase tracking-[0.12em] text-[#5f6877]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {employees.map((employee) => (
              <EmployeeRow key={employee.employeeId} {...employee} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EmployeeTable;
