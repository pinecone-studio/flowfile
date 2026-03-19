<<<<<<< Updated upstream
import { notFound } from 'next/navigation';
import { EmployeeDetailClient } from '../../../features/employees/detail/EmployeeDetailClient';
import {
  employeeProfiles,
  getEmployeeProfile,
} from '../../../features/employees/detail/employeeProfile.data';

type EmployeeDetailRouteProps = {
  params: Promise<{ employeeId: string }>;
};

export function generateStaticParams() {
  return Object.keys(employeeProfiles).map((employeeId) => ({ employeeId }));
}

export default async function EmployeeDetailRoute({
  params,
}: EmployeeDetailRouteProps) {
  const { employeeId } = await params;
  const profile = getEmployeeProfile(employeeId);

  if (!profile) {
    notFound();
  }

  return <EmployeeDetailClient employeeId={employeeId} />;
=======
import EmployeeDetailPage from '../../../features/employees/EmployeeDetailPage';

export function generateStaticParams() {
  return [{ employeeId: 'emp-0042' }];
}

export default function EmployeeDetail() {
  return <EmployeeDetailPage />;
>>>>>>> Stashed changes
}
