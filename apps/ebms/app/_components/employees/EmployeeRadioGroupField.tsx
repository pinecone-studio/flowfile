'use client';

import type { AddEmployeeFieldName } from '../lib/employee/types';

type RadioOption = {
  label: string;
  value: string;
};

type EmployeeRadioGroupFieldProps = {
  label: string;
  name: AddEmployeeFieldName;
  value: string;
  options: RadioOption[];
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const EmployeeRadioGroupField = ({
  label,
  name,
  value,
  options,
  onChange,
}: EmployeeRadioGroupFieldProps) => {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-[12px] font-normal leading-5 text-[#4b5565]">
        {label}
      </legend>

      <div className="flex flex-wrap items-center gap-4">
        {options.map((option) => {
          const isChecked = value === option.value;

          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-[12px] text-[#374151]"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(name, option.value)}
                className="sr-only"
              />

              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#c4cad6] bg-white">
                {isChecked ? (
                  <span className="h-2 w-2 rounded-full bg-[#111827]" />
                ) : null}
              </span>

              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export default EmployeeRadioGroupField;
