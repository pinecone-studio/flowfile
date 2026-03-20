import type { ApiEmployee } from './employeeDetail.api';
import type { TriggerActionDefinition } from './employeeDetail.transform';

export const fallbackTriggerActions: TriggerActionDefinition[] = [
  {
    actionName: 'add_employee',
    label: 'Onboard',
    fields: ['status', 'hireDate'],
    phase: 'onboarding',
    documents: [
      'employment_contract',
      'probation_order',
      'job_description',
      'nda',
    ],
    recipientRoles: ['hr_team', 'department_chief', 'branch_manager'],
  },
  {
    actionName: 'change_position',
    label: 'Change Role',
    fields: ['department', 'branch', 'level'],
    phase: 'working',
    documents: ['job_description', 'position_update_order', 'contract_addendum'],
    recipientRoles: ['hr_team', 'department_chief', 'branch_manager'],
  },
  {
    actionName: 'salary_increase',
    label: 'Promote',
    fields: ['level', 'numberOfVacationDays', 'isSalaryCompany'],
    phase: 'working',
    documents: ['salary_increase_order'],
    recipientRoles: ['hr_team', 'department_chief'],
  },
  {
    actionName: 'offboard_employee',
    label: 'Terminate',
    fields: ['terminationDate', 'status'],
    phase: 'offboarding',
    documents: ['termination_order', 'handover_sheet'],
    recipientRoles: ['hr_team', 'department_chief', 'ceo'],
  },
];

function toDraftValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (value == null) {
    return '';
  }

  return String(value);
}

function coerceValue(rawValue: string, currentValue: unknown) {
  if (rawValue === '') {
    return '';
  }

  if (typeof currentValue === 'boolean') {
    return rawValue === 'true';
  }

  if (typeof currentValue === 'number') {
    const parsed = Number(rawValue);
    return Number.isNaN(parsed) ? rawValue : parsed;
  }

  return rawValue;
}

export function buildActionDraftValues(
  action: TriggerActionDefinition,
  employee: ApiEmployee | null,
) {
  return Object.fromEntries(
    action.fields.map((fieldName) => [
      fieldName,
      toDraftValue(employee?.[fieldName as keyof ApiEmployee]),
    ]),
  );
}

export function buildTriggerPayload(
  action: TriggerActionDefinition,
  values: Record<string, string>,
  employee: ApiEmployee | null,
) {
  return Object.fromEntries(
    action.fields
      .map((fieldName) => {
        const rawValue = values[fieldName] ?? '';
        const coercedValue = coerceValue(
          rawValue,
          employee?.[fieldName as keyof ApiEmployee],
        );

        return [fieldName, coercedValue];
      })
      .filter(([, value]) => value !== ''),
  );
}
