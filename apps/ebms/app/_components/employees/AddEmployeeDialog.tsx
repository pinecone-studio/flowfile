'use client';

import { useState } from 'react';
import { AddEmployeeForm } from './AddEmployeeForm';
import {
  AddEmployeeFieldName,
  AddEmployeeFormData,
  AddEmployeeFormErrors,
} from '../lib/employee/types';
import { createInitialAddEmployeeForm } from '../lib/employee/createInitialAddEmployeeForm';

import { AddEmployeeButton } from './addEmployeeButton';
import validateAddEmployeeForm from '../lib/employee/validateAddEmployeeForm';

export const AddEmployeeDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<AddEmployeeFormData>(
    createInitialAddEmployeeForm(),
  );
  const [errors, setErrors] = useState<AddEmployeeFormErrors>({});

  const openDialog = (): void => {
    setIsOpen(true);
  };

  const resetDialog = (): void => {
    setForm(createInitialAddEmployeeForm());
    setErrors({});
  };

  const closeDialog = (): void => {
    setIsOpen(false);
    resetDialog();
  };

  const handleChange = (name: AddEmployeeFieldName, value: string): void => {
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    const nextErrors = validateAddEmployeeForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      console.log('EPAS onboarding payload', {
        action: 'add_employee',
        employee: form,
      });

      closeDialog();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AddEmployeeButton onClick={openDialog} />

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Employee
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create employee and start onboarding paperwork
                </p>
              </div>
            </div>

            <div className="p-6">
              <AddEmployeeForm
                form={form}
                errors={errors}
                isSubmitting={isSubmitting}
                onCancel={closeDialog}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
