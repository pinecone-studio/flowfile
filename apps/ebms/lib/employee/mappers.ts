import type { EmployeeDto } from './types';
import { resolveImageSrc } from '../assets/resolveImageSrc';
import type { EmployeeCardRecord } from '../../features/showcase/showcase.data';

function mapStatus(
  status: EmployeeDto['status'],
): EmployeeCardRecord['status'] {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'INACTIVE':
      return 'Inactive';
    case 'TERMINATED':
      return 'Terminated';
  }
}

function mapStatusTone(
  status: EmployeeDto['status'],
): EmployeeCardRecord['statusTone'] {
  switch (status) {
    case 'ACTIVE':
      return 'active';
    case 'INACTIVE':
      return 'inactive';
    case 'TERMINATED':
      return 'warning';
  }
}

function mapActionTone(
  status: EmployeeDto['status'],
): EmployeeCardRecord['actionTone'] {
  switch (status) {
    case 'ACTIVE':
      return 'onboarding';
    case 'INACTIVE':
      return 'neutral';
    case 'TERMINATED':
      return 'terminate';
  }
}

function formatLatestDate(date?: string | null): string {
  if (!date) return '-';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return `(${parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })})`;
}

export function mapEmployeeToPreviewCardData(
  employee: EmployeeDto,
): EmployeeCardRecord {
  return {
    id: employee.id,
    status: mapStatus(employee.status),
    statusTone: mapStatusTone(employee.status),
    image: resolveImageSrc(employee.imageUrl, '/image%205.svg'),
    role: employee.level ?? 'Unknown Position',
    name: `${employee.firstName}.${employee.lastName}`,
    email: employee.email ?? '-',
    latestAction: employee.status === 'TERMINATED' ? 'Terminate' : 'Onboarding',
    actionTone: mapActionTone(employee.status),
    latestDate: formatLatestDate(employee.updatedAt),
  };
}
