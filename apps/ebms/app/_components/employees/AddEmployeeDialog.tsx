'use client';

import { useState } from "react";
import { AddEmployeeFieldName, AddEmployeeFormData, AddEmployeeFormErrors } from "../lib/employee/types";
import { createInitialAddEmployeeForm } from "../lib/employee/createInitialAddEmployeeForm";
import validateAddEmployeeForm from "../lib/employee/validateAddEmployeeForm";
import AddEmployeeButton from "./addEmployeeButton";
import AddEmployeeForm from "./AddEmployeeForm";

const createInitialErrors = (): AddEmployeeFormErrors => {
  return {
    firstName: '',
    lastName: '',
    firstNameEng: '',
    lastNameEng: '',
    email: '',
    employeeCode: '',
    department: '',
    branch: '',
    level: '',
    hireDate: '',
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-8">
          <div className="w-full max-w-4xl overflow-hidden rounded-md border border-[#cfcfcf] bg-[#e9ebf3] shadow-lg">
            <div className="flex items-center justify-between border-b border-[#cfcfcf] bg-white px-4 py-2">
              <h2 className="w-full text-center text-[14px] font-semibold text-[#1f1f1f]">
                Add Employeeee
              </h2>

              <button
                type="button"
                aria-label="Close dialog"
                onClick={handleClose}
                className="ml-4 text-[18px] leading-none text-[#333333]"
              >
                ×
              </button>
            </div>

            <AddEmployeeForm
              form={form}
              errors={errors}
              isSubmitting={isSubmitting}
              onCancel={handleClose}
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