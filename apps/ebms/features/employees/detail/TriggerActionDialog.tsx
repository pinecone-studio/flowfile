'use client';

import { X } from 'lucide-react';
import type { TriggerActionDefinition } from './employeeDetail.transform';

type TriggerActionDialogProps = {
  action: TriggerActionDefinition | null;
  values: Record<string, string>;
  isSubmitting: boolean;
  onChange: (fieldName: string, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function getFieldLabel(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (value) => value.toUpperCase());
}

function getFieldType(fieldName: string) {
  if (/^is[A-Z]/.test(fieldName)) {
    return 'boolean';
  }

  if (/email/i.test(fieldName)) {
    return 'email';
  }

  return /date/i.test(fieldName) ? 'date' : /days|number/i.test(fieldName) ? 'number' : 'text';
}

function toTitleCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

type TriggerRule = {
  field: string;
  condition: string;
  actionFired: string;
};

type SelectOption = {
  value: string;
  label: string;
};

const triggerRulesByAction: Partial<Record<string, TriggerRule[]>> = {
  salary_increase: [
    {
      field: 'level',
      condition: 'Value increases (promotion)',
      actionFired: 'promote_employee',
    },
    {
      field: 'numberOfVacationDays',
      condition: 'Value changes (benefit change)',
      actionFired: 'promote_employee',
    },
    {
      field: 'isSalaryCompany',
      condition: 'Value changes',
      actionFired: 'promote_employee',
    },
  ],
  promote_employee: [
    {
      field: 'level',
      condition: 'Value increases (promotion)',
      actionFired: 'promote_employee',
    },
    {
      field: 'numberOfVacationDays',
      condition: 'Value changes (benefit change)',
      actionFired: 'promote_employee',
    },
    {
      field: 'isSalaryCompany',
      condition: 'Value changes',
      actionFired: 'promote_employee',
    },
  ],
  change_position: [
    {
      field: 'department',
      condition: 'Value changes (any)',
      actionFired: 'change_position',
    },
    {
      field: 'branch',
      condition: 'Value changes (any)',
      actionFired: 'change_position',
    },
    {
      field: 'level',
      condition: 'Value changes laterally or decreases',
      actionFired: 'change_position',
    },
  ],
  offboard_employee: [
    {
      field: 'terminationDate',
      condition: 'Field set (was null)',
      actionFired: 'offboard_employee',
    },
    {
      field: 'status',
      condition: 'New value = TERMINATED or INACTIVE',
      actionFired: 'offboard_employee',
    },
  ],
};

const salaryIncreaseActionNames = new Set(['salary_increase', 'promote_employee']);

const salaryIncreaseSelectOptions: Record<string, SelectOption[]> = {
  level: [
    { value: 'Junior', label: 'Junior' },
    { value: 'Mid', label: 'Mid' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Lead', label: 'Lead' },
    { value: 'Manager', label: 'Manager' },
  ],
  numberOfVacationDays: [
    { value: '15', label: '15 days' },
    { value: '18', label: '18 days' },
    { value: '20', label: '20 days' },
    { value: '22', label: '22 days' },
    { value: '25', label: '25 days' },
    { value: '30', label: '30 days' },
  ],
  isSalaryCompany: [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ],
};

function isSalaryIncreaseAction(actionName: string) {
  return salaryIncreaseActionNames.has(actionName);
}

function getSelectOptionLabel(fieldName: string, value: string) {
  if (fieldName === 'isSalaryCompany') {
    return value === 'true' ? 'Yes' : value === 'false' ? 'No' : value;
  }

  if (fieldName === 'numberOfVacationDays') {
    return `${value} days`;
  }

  return value;
}

function getSalaryIncreaseSelectOptions(fieldName: string, currentValue: string) {
  const options = salaryIncreaseSelectOptions[fieldName] ?? [];

  if (!currentValue || options.some((option) => option.value === currentValue)) {
    return options;
  }

  return [
    {
      value: currentValue,
      label: getSelectOptionLabel(fieldName, currentValue),
    },
    ...options,
  ];
}

export function TriggerActionDialog({
  action,
  values,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: TriggerActionDialogProps) {
  if (!action) {
    return null;
  }
  const triggerRules = triggerRulesByAction[action.actionName] ?? [];
  const compactSalaryIncreaseDialog = isSalaryIncreaseAction(action.actionName);
  const description = compactSalaryIncreaseDialog
    ? null
    : triggerRules.length > 0
      ? 'Trigger rules for this action.'
      : action.fields.length > 0
        ? 'Review the fields below before triggering this action.'
        : 'Trigger this action directly.';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#020713]/78 px-4 py-8 backdrop-blur-[10px]">
      <div className="mx-auto w-full max-w-[680px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,28,49,0.98)_0%,rgba(8,15,29,0.98)_100%)] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[16px] font-medium uppercase tracking-[0.18em] text-[#6f86b4]">
              {action.phase ? toTitleCase(action.phase) : 'Trigger Action'}
            </p>
            <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-white">
              {action.label}
            </h2>
            {description ? (
              <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-[#c7d4ef]">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Close trigger action dialog"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/5 text-[#ebf1ff] transition hover:bg-white/10"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        {triggerRules.length > 0 && !compactSalaryIncreaseDialog ? (
          <div className="mt-6 rounded-[20px] border border-white/10 bg-[#0b162a] px-5 py-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8ea4d3]">
              Employee Trigger Rules
            </p>
            <div className="mt-4 overflow-hidden rounded-[18px] border border-white/8">
              <div className="grid grid-cols-[1.2fr_1.6fr_1.1fr] bg-[#12213e] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8ea4d3]">
                <span>Employee Field Changed</span>
                <span>Condition</span>
                <span>Action Fired</span>
              </div>
              {triggerRules.map((rule) => (
                <div
                  key={`${rule.field}:${rule.condition}`}
                  className="grid grid-cols-[1.2fr_1.6fr_1.1fr] gap-3 border-t border-white/8 bg-[#101d36] px-4 py-3 text-[14px] text-white"
                >
                  <span>{rule.field}</span>
                  <span className="text-[#d8e3f8]">{rule.condition}</span>
                  <span className="text-[#9fc2ff]">{rule.actionFired}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {compactSalaryIncreaseDialog ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {action.fields.map((fieldName) => {
              const options = getSalaryIncreaseSelectOptions(
                fieldName,
                values[fieldName] ?? '',
              );

              return (
                <label
                  key={fieldName}
                  className="rounded-[20px] border border-white/10 bg-[#0b162a] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[15px] font-medium text-white">
                      {getFieldLabel(fieldName)}
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[11px] text-[#8ea4d3]">
                      {fieldName}
                    </span>
                  </div>

                  <select
                    value={values[fieldName] ?? ''}
                    onChange={(event) => onChange(fieldName, event.target.value)}
                    className="mt-4 h-[50px] w-full rounded-[14px] border border-[#294777] bg-[#10203b] px-4 text-[16px] text-white outline-none transition focus:border-[#4272c2]"
                  >
                    <option value="" disabled>
                      Select {getFieldLabel(fieldName)}
                    </option>
                    {options.map((option) => (
                      <option key={`${fieldName}:${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8ea4d3]">
                Editable Action Fields
              </p>
              <p className="mt-2 text-[14px] leading-6 text-[#afc0e3]">
                These values are prefilled from the employee record and will be merged
                into the triggered workflow payload.
              </p>
            </div>

            {action.fields.length > 0 ? action.fields.map((fieldName) => {
              const fieldType = getFieldType(fieldName);

              return (
                <label key={fieldName} className="block">
                  <span className="mb-2 block text-[15px] font-medium text-[#93a7d1]">
                    {getFieldLabel(fieldName)}
                  </span>
                  {fieldType === 'boolean' ? (
                    <select
                      value={values[fieldName] ?? 'false'}
                      onChange={(event) => onChange(fieldName, event.target.value)}
                      className="h-[50px] w-full rounded-[14px] border border-[#294777] bg-[#10203b] px-4 text-[16px] text-white outline-none transition focus:border-[#4272c2]"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <input
                      type={fieldType}
                      value={values[fieldName] ?? ''}
                      onChange={(event) => onChange(fieldName, event.target.value)}
                      className="h-[50px] w-full rounded-[14px] border border-[#294777] bg-[#10203b] px-4 text-[16px] text-white outline-none transition focus:border-[#4272c2]"
                    />
                  )}
                </label>
              );
            }) : (
              <p className="rounded-[16px] bg-[#10203b] px-4 py-4 text-[16px] text-[#dce7fb]">
                This action does not require any extra fields. Trigger it directly.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[48px] rounded-[14px] border border-white/10 px-6 text-[16px] font-medium text-[#d7e1f5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-[48px] rounded-[14px] bg-[#2c5297] px-6 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Triggering...' : `Trigger ${action.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
