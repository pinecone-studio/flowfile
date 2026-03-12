'use client';

import { AddEmployeeFieldName } from "../lib/employee/types";

type EmployeeFormFieldProps = {
  label: string;
  name: AddEmployeeFieldName;
  value: string;
  error?: string;
  type?: 'text' | 'email' | 'date';
  readOnly?: boolean;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

export const EmployeeFormField = ({
  label,
  name,
  value,
  error,
  type = 'text',
  readOnly = false,
  onChange,
}: EmployeeFormFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(name, event.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
      />

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
};
