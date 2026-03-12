'use client';

import type { ChangeEvent } from 'react';
import type { AddEmployeeFieldName } from '../lib/employee/types';

type EmployeeFormFieldProps = {
  label: string;
  name: AddEmployeeFieldName;
  value: string;
  error?: string;
  type?: 'text' | 'email' | 'date';
  placeholder?: string;
  readOnly?: boolean;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const getInputClassName = (error?: string): string => {
  const baseClassName = [
    'h-8 w-full rounded-[16px] border bg-[#f8f8f8] px-4 text-[12px]',
    'text-[#2b2f38] outline-none transition placeholder:text-[#9aa3b2]',
  ].join(' ');

  if (error) {
    return `${baseClassName} border-rose-500 focus:border-rose-500`;
  }

  return `${baseClassName} border-[#c7ccd6] focus:border-[#b9c1cf]`;
};

const renderError = (error?: string) => {
  if (!error) {
    return <div className="min-h-[16px]" />;
  }

  return (
    <p className="min-h-[16px] text-[11px] leading-4 text-rose-600">
      {error}
    </p>
  );
};

const EmployeeFormField = ({
  label,
  name,
  value,
  error,
  type = 'text',
  placeholder,
  readOnly = false,
  onChange,
}: EmployeeFormFieldProps) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    onChange(name, event.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-[12px] font-normal leading-5 text-[#4b5565]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={handleChange}
        className={getInputClassName(error)}
      />

      {renderError(error)}
    </div>
  );
};

export default EmployeeFormField;