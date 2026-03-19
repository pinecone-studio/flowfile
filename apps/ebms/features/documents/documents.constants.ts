import type { DocumentsCategoryKey } from './documents.types';

export const actionLabels: Record<
  Exclude<DocumentsCategoryKey, 'all'>,
  string
> = {
  add_employee: 'Onboarding',
  salary_increase: 'Promotion',
  change_position: 'Role Change',
  offboard_employee: 'Offboarding',
};

export const actionOrder: DocumentsCategoryKey[] = [
  'all',
  'add_employee',
  'salary_increase',
  'change_position',
  'offboard_employee',
];

export const actionTones: Record<
  Exclude<DocumentsCategoryKey, 'all'>,
  'onboarding' | 'promotion' | 'role-change' | 'offboarding'
> = {
  add_employee: 'onboarding',
  salary_increase: 'promotion',
  change_position: 'role-change',
  offboard_employee: 'offboarding',
};
