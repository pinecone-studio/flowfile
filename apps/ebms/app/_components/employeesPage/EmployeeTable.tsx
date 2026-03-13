
import AddEmployeeDialog from '../employees/AddEmployeeDialog';
import EmployeeRow from './EmployeeRow';
import EmployeeSearch from './EmployeeSearch';

const EmployeeTable = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Employee Management
        </h2>

        <AddEmployeeDialog />
      </div>

      <div className="mb-5">
        <EmployeeSearch />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full border-collapse">
          <thead className="bg-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Employee
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Position
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Hire Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Latest Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            <EmployeeRow
              image="pro5.png"
              employeeId="EM-001"
              employeeName="Bilguundul.B"
              position="Chief Learning Officer"
              hireDate="2024-09-07"
              latestAction="change_position"
              status="Active"
            />
            <EmployeeRow
              image="pro1.png"
              employeeId="EM-002"
              employeeName="Bolor.E"
              position="Marketing Director"
              hireDate="2025-01-15"
              latestAction="offboard_employee"
              status="Active"
            />
            <EmployeeRow
              image="pro2.png"
              employeeId="EM-003"
              employeeName="Javkhlantugs.B"
              position="Tech lead & SproutLab Director"
              hireDate="2025-03-20"
              latestAction="change-position"
              status="Active"
            />
            <EmployeeRow
              image="pro3.png"
              employeeId="EM-004"
              employeeName="Narantsatsralt.B"
              position="Engineer Manager"
              hireDate="2025-03-20"
              latestAction="change-position"
              status="Active"
            />
            <EmployeeRow
              image="pro5.png"
              employeeId="EM-005"
              employeeName="Munkhtulga.N"
              position="Product Designerh"
              hireDate="2025-03-20"
              latestAction="add_employee"
              status="Active"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
