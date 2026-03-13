'use client';

import type { ChangeEvent } from 'react';
import type { AddEmployeeFieldName } from '../lib/employee/types';
import EmployeeFieldLabel from './EmployeeFieldLabel';

type EmployeeFormFieldProps = {
  label?: string;
  name: AddEmployeeFieldName;
  value: string;
  error?: string;
  type?: 'text' | 'email' | 'number';
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const getInputClassName = (
  error?: string,
  readOnly = false,
  inputClassName = ''
): string => {
  const baseClassName =
    'h-[32px] w-full rounded-[4px] border bg-white px-3 text-[12px]';
  const textClassName =
    'text-[#0f172a] outline-none transition placeholder:text-[#c4c9d2]';
  const readOnlyClassName = ['', 'bg-[#f3f4f6]'][Number(readOnly)];
  const stateClassName = error
    ? 'border-rose-500 focus:border-rose-500'
    : 'border-[#c7ccd6] focus:border-[#b9c1cf]';

  return [
    baseClassName,
    textClassName,
    readOnlyClassName,
    stateClassName,
    inputClassName,
  ].join(' ');
};

const renderError = (error?: string) => {
  return error ? (
    <p className="text-[11px] leading-4 text-rose-600">{error}</p>
  ) : null;
};

const EmployeeFormField = ({
  label,
  name,
  value,
  error,
  type,
  placeholder,
  readOnly,
  required,
  containerClassName,
  inputClassName,
  onChange,
}: EmployeeFormFieldProps) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    onChange(name, event.target.value);
  };

  return (
    <div className={`flex flex-col gap-1 ${containerClassName ?? ''}`.trim()}>
      <EmployeeFieldLabel label={label} name={name} required={required} />

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={handleChange}
        className={getInputClassName(error, readOnly, inputClassName ?? '')}
      />

      {renderError(error)}
    </div>
  );
};

export default EmployeeFormField;
