'use client';

import { ChevronDown } from 'lucide-react';
import type { AddEmployeeFieldName } from '../lib/employee/types';
import EmployeeFieldLabel from './EmployeeFieldLabel';

type SelectOption = {
  label: string;
  value: string;
};

type EmployeeSelectFieldProps = {
  label?: string;
  name: AddEmployeeFieldName;
  value: string;
  error?: string;
  options: SelectOption[];
  placeholder: string;
  required?: boolean;
  containerClassName?: string;
  selectClassName?: string;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const getSelectClassName = (
  error?: string,
  selectClassName = ''
): string => {
  const stateClassName = error ? 'border-[#ef4444]' : 'border-[#c4cad6]';

  return [
    'h-[32px] w-full appearance-none rounded-[4px] border bg-white px-3 text-[12px]',
    'text-[#0f172a] outline-none transition',
    stateClassName,
    selectClassName,
  ].join(' ');
};

const renderSelectError = (error?: string) => {
  return error ? (
    <p className="text-[11px] leading-4 text-[#ef4444]">{error}</p>
  ) : null;
};

const EmployeeSelectField = ({
  label,
  name,
  value,
  error,
  options,
  placeholder,
  required,
  containerClassName,
  selectClassName,
  onChange,
}: EmployeeSelectFieldProps) => {
  const resolvedRequired = required ?? false;
  const resolvedContainerClassName = containerClassName ?? '';
  const resolvedSelectClassName = selectClassName ?? '';

  return (
    <div
      className={`flex flex-col gap-1 ${resolvedContainerClassName}`.trim()}
    >
      <EmployeeFieldLabel
        label={label}
        name={name}
        required={resolvedRequired}
      />

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          className={getSelectClassName(error, resolvedSelectClassName)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
      </div>

      {renderSelectError(error)}
    </div>
  );
};

export default EmployeeSelectField;
