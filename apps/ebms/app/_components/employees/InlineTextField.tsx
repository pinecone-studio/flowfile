'use client';

import type { ChangeEvent } from 'react';
import type { AddEmployeeFieldName } from '../lib/employee/types';

type InlineTextFieldProps = {
  label: string;
  name: AddEmployeeFieldName;
  value: string;
  error?: string;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
  labelWidthClassName: string;
  inputClassName: string;
  wrapperClassName?: string;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const getInputStateClassName = (error?: string): string => {
  return error
    ? 'border-[#ef4444] focus:border-[#ef4444]'
    : 'border-[#c4cad6] focus:border-[#b9c1cf]';
};

const renderRequiredMark = (required = false) => {
  return required ? <span className="ml-1 text-[#ef4444]">*</span> : null;
};

const renderInlineError = (error?: string) => {
  return error ? (
    <p className="text-[11px] leading-4 text-[#ef4444]">{error}</p>
  ) : null;
};

const InlineTextField = ({
  label,
  name,
  value,
  error,
  placeholder,
  type,
  required,
  labelWidthClassName,
  inputClassName,
  wrapperClassName,
  onChange,
}: InlineTextFieldProps) => {
  const resolvedType = type ?? 'text';
  const resolvedRequired = required ?? false;
  const resolvedWrapperClassName = wrapperClassName ?? '';

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(name, event.target.value);
  };

  return (
    <div
      className={`flex flex-col gap-1 ${resolvedWrapperClassName}`.trim()}
    >
      <div className="flex items-center gap-[14px]">
        <label
          htmlFor={name}
          className={`${labelWidthClassName} text-[14px] leading-[27px] text-[#4b5565]`.trim()}
        >
          {label}
          {renderRequiredMark(resolvedRequired)}
        </label>

        <input
          id={name}
          name={name}
          type={resolvedType}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className={`${inputClassName} h-[32px] rounded-[4px] border bg-white px-4 text-[12px] text-[#0f172a] outline-none placeholder:text-[#c4c9d2] ${getInputStateClassName(error)}`.trim()}
        />
      </div>

      {renderInlineError(error)}
    </div>
  );
};

export default InlineTextField;
