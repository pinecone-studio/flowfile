
'use client';

import type { FormEvent } from 'react';
import type {
  AddEmployeeFieldName,
  AddEmployeeFormData,
  AddEmployeeFormErrors,
} from '../lib/employee/types';
import ContractAndContactSection from './ContractAndContactSection';
import PersonalInformationSection from './PersonalInformationSection';
import WorkInformationSection from './WorkInformationSection';

type AddEmployeeFormProps = {
  form: AddEmployeeFormData;
  errors: AddEmployeeFormErrors;
  isSubmitting: boolean;
  onCancel: () => void;
  onDemo: () => void;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
  onSubmit: () => Promise<void>;
};

const AddEmployeeForm = ({
  form,
  errors,
  isSubmitting,
  onCancel,
  onDemo,
  onChange,
  onSubmit,
}: AddEmployeeFormProps) => {
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-6 bg-[#dfe4f1] px-6 py-6"
    >
      <div className="flex flex-1 flex-col gap-6">
        <PersonalInformationSection
          form={form}
          errors={errors}
          onChange={onChange}
        />
        <WorkInformationSection
          form={form}
          errors={errors}
          onChange={onChange}
        />
        <ContractAndContactSection
          form={form}
          errors={errors}
          onChange={onChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="h-[32px] min-w-[82px] rounded-[4px] border border-[#c4cad6] bg-white px-5 text-[14px] font-medium text-[#6b7280]"
        >
          Cancel
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDemo}
            disabled={isSubmitting}
            className="h-[32px] min-w-[74px] rounded-[4px] border border-[#c4cad6] bg-white px-4 text-[14px] font-medium text-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Demo
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[32px] min-w-[142px] rounded-[4px] border border-[#c4cad6] bg-white px-5 text-[14px] font-medium text-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating...' : 'Create Employee'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddEmployeeForm;
