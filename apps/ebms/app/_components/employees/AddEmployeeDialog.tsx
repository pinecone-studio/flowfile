'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { createDemoAddEmployeeForm } from '../lib/employee/createDemoAddEmployeeForm';
import { createInitialAddEmployeeForm } from '../lib/employee/createInitialAddEmployeeForm';
import type {
  AddEmployeeFieldName,
  AddEmployeeFormData,
  AddEmployeeFormErrors,
} from '../lib/employee/types';
import validateAddEmployeeForm from '../lib/employee/validateAddEmployeeForm';
import AddEmployeeForm from './AddEmployeeForm';
import AddEmployeeButton from './addEmployeeButton';

const createInitialErrors = (): AddEmployeeFormErrors => {
  return {
    firstName: '',
    lastName: '',
    firstNameEng: '',
    lastNameEng: '',
    birthMonth: '',
    birthDay: '',
    email: '',
    employeeCode: '',
    department: '',
    branch: '',
    positionTitle: '',
    hireDate: '',
    annualVacationDays: '',
    kpiEligible: '',
    salaryFromCompany: '',
    status: '',
  };
};

const isFormValid = (
  nextErrors: AddEmployeeFormErrors
): boolean => {
  return Object.values(nextErrors).every((value) => value === '');
};

const AddEmployeeDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<AddEmployeeFormData>(
    createInitialAddEmployeeForm()
  );
  const [errors, setErrors] = useState<AddEmployeeFormErrors>(
    createInitialErrors()
  );

  const handleOpen = (): void => {
    setIsOpen(true);
  };

  const handleClose = (): void => {
    setIsOpen(false);
    setIsSubmitting(false);
    setForm(createInitialAddEmployeeForm());
    setErrors(createInitialErrors());
  };

  const handleChange = (
    name: AddEmployeeFieldName,
    value: string
  ): void => {
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  };

  const handleDemo = (): void => {
    setForm(createDemoAddEmployeeForm());
    setErrors(createInitialErrors());
  };

  const handleSubmit = async (): Promise<void> => {
    const nextErrors = validateAddEmployeeForm(form);

    setErrors(nextErrors);

    if (!isFormValid(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AddEmployeeButton onClick={handleOpen} />

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-4"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-employee-title"
            className="flex h-[921px] w-[668px] flex-col overflow-hidden rounded-[8px] border border-[#202020] bg-[#dfe4f1] shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-[44px] items-center justify-between border-b border-[#cfd5e0] bg-white px-6">
              <div className="w-10" />
              <h2
                id="add-employee-title"
                className="text-[20px] font-semibold text-[#111111]"
              >
                Add Employee
              </h2>

              <button
                type="button"
                aria-label="Close dialog"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center text-[#111111]"
              >
                <X className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </div>

            <AddEmployeeForm
              form={form}
              errors={errors}
              isSubmitting={isSubmitting}
              onCancel={handleClose}
              onDemo={handleDemo}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddEmployeeDialog;
