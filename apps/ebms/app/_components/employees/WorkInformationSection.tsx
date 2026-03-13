import type {
  AddEmployeeFormData,
  AddEmployeeFormErrors,
  AddEmployeeFieldName,
} from '../lib/employee/types';
import EmployeeFormSection from './EmployeeFormSection';
import InlineRadioField from './InlineRadioField';
import InlineTextField from './InlineTextField';

const statusOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Terminated', value: 'TERMINATED' },
];

type WorkInformationSectionProps = {
  form: AddEmployeeFormData;
  errors: AddEmployeeFormErrors;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const WorkInformationSection = ({
  form,
  errors,
  onChange,
}: WorkInformationSectionProps) => {
  return (
    <EmployeeFormSection title="Work Information" className="h-[267px]">
      <div className="w-[572px] space-y-[27px]">
        <div className="grid grid-cols-[273px_273px] gap-x-[26px]">
          <InlineTextField
          label="Employee Code"
          name="employeeCode"
          value={form.employeeCode}
          error={errors.employeeCode}
          placeholder="EMP-001"
          required
          labelWidthClassName="w-[104px]"
          inputClassName="w-[155px]"
          onChange={onChange}
        />
          <InlineTextField
          label="Department"
          name="department"
          value={form.department}
          error={errors.department}
          required
          labelWidthClassName="w-[101px]"
          inputClassName="w-[158px]"
          onChange={onChange}
        />
        </div>

        <div className="grid grid-cols-[273px_273px] gap-x-[26px]">
          <InlineTextField
          label="Position Title"
          name="positionTitle"
          value={form.positionTitle}
          error={errors.positionTitle}
          required
          labelWidthClassName="w-[104px]"
          inputClassName="w-[155px]"
          onChange={onChange}
        />
          <InlineTextField
          label="Branch"
          name="branch"
          value={form.branch}
          error={errors.branch}
          required
          labelWidthClassName="w-[101px]"
          inputClassName="w-[158px]"
          onChange={onChange}
        />
        </div>

        <InlineTextField
            label="Hire Date"
            name="hireDate"
            value={form.hireDate}
            error={errors.hireDate}
            placeholder="YYYY / MM / DD"
            required
            labelWidthClassName="w-[77px]"
            inputClassName="w-[182px]"
            wrapperClassName="w-[273px]"
            onChange={onChange}
          />

        <InlineRadioField
          label="Status"
          name="status"
          value={form.status}
          options={statusOptions}
          labelWidthClassName="w-[130px]"
          optionsClassName="gap-[18px]"
          wrapperClassName="w-[321px]"
          onChange={onChange}
        />
      </div>
    </EmployeeFormSection>
  );
};

export default WorkInformationSection;
