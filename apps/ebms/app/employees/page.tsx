import EmployeePage from '../../features/employees/EmployeePage';
import { getEmployees } from '../../lib/employee/api';

export default async function Employees() {
  const employees = await getEmployees();

  return <EmployeePage employees={employees} />;
}

/*import EmployeePage from '../../features/employees/EmployeePage';

export default function Employees() {
  return <EmployeePage />;
}*/
