'use client';

import type { FormEvent } from 'react';

import { EmployeeFormField } from './EmployeeFormField';
import {
  AddEmployeeFieldName,
  AddEmployeeFormData,
  AddEmployeeFormErrors,
} from '../lib/employee/types';

type AddEmployeeFormProps = {
  form: AddEmployeeFormData;
  errors: AddEmployeeFormErrors;
  isSubmitting: boolean;
  onCancel: () => void;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
  onSubmit: () => Promise<void>;
};

export const AddEmployeeForm = ({
  form,
  errors,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
}: AddEmployeeFormProps) => {
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    await onSubmit();
  };

  const fullName = `${form.lastName} ${form.firstName}`.trim();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EmployeeFormField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          error={errors.lastName}
          onChange={onChange}
        />

        <EmployeeFormField
          label="First Name"
          name="firstName"
          value={form.firstName}
          error={errors.firstName}
          onChange={onChange}
        />

        <EmployeeFormField
          label="Last Name (English)"
          name="lastNameEng"
          value={form.lastNameEng}
          error={errors.lastNameEng}
          onChange={onChange}
        />

        <EmployeeFormField
          label="First Name (English)"
          name="firstNameEng"
          value={form.firstNameEng}
          error={errors.firstNameEng}
          onChange={onChange}
        />

        <EmployeeFormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={onChange}
        />

        <EmployeeFormField
          label="Employee Code"
          name="employeeCode"
          value={form.employeeCode}
          readOnly
          onChange={onChange}
        />

        <EmployeeFormField
          label="Department"
          name="department"
          value={form.department}
          error={errors.department}
          onChange={onChange}
        />

        <EmployeeFormField
          label="Branch"
          name="branch"
          value={form.branch}
          error={errors.branch}
          onChange={onChange}
        />

        <EmployeeFormField
          label="Level"
          name="level"
          value={form.level}
          error={errors.level}
          onChange={onChange}
        />

        <EmployeeFormField
          label="Hire Date"
          name="hireDate"
          type="date"
          value={form.hireDate}
          error={errors.hireDate}
          onChange={onChange}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
};
