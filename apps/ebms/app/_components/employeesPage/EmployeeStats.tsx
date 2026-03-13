import { Building2, CalendarDays, UserRoundPlus, UsersRound } from 'lucide-react';
import { EmployeeStatCard } from './EmployeeStatCard';

export default function EmployeeStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <EmployeeStatCard
        title="Total Employees"
        value="5"
        icon={UsersRound}
      />
      <EmployeeStatCard
        title="New Hires This Month"
        value="0"
        icon={UserRoundPlus}
      />
      <EmployeeStatCard
        title="Average Tenure"
        value="6.1 years"
        icon={CalendarDays}
      />
      <EmployeeStatCard
        title="Active Departments"
        value="4"
        icon={Building2}
      />
    </div>
  );
}
