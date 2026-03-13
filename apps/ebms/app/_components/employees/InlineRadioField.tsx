'use client';

import type { AddEmployeeFieldName } from '../lib/employee/types';

type RadioOption = {
  label: string;
  value: string;
};

type InlineRadioFieldProps = {
  label: string;
  name: AddEmployeeFieldName;
  value: string;
  options: RadioOption[];
  labelWidthClassName: string;
  optionsClassName?: string;
  wrapperClassName?: string;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const InlineRadioField = ({
  label,
  name,
  value,
  options,
  labelWidthClassName,
  optionsClassName = 'gap-[18px]',
  wrapperClassName = '',
  onChange,
}: InlineRadioFieldProps) => {
  return (
    <fieldset className={`flex items-center ${wrapperClassName}`.trim()}>
      <legend
        className={`${labelWidthClassName} shrink-0 text-[14px] leading-[27px] text-[#4b5565]`.trim()}
      >
        {label}
      </legend>

      <div className={`flex items-center ${optionsClassName}`.trim()}>
        {options.map((option) => {
          const isChecked = value === option.value;

          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-[11px] text-[14px] text-[#1f2937]"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(name, option.value)}
                className="sr-only"
              />

              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#c4cad6] bg-white">
                {isChecked ? (
                  <span className="h-[10px] w-[10px] rounded-full bg-[#111827]" />
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

export default InlineRadioField;
