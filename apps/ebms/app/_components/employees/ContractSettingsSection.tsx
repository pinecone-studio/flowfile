import type {
  AddEmployeeFormData,
  AddEmployeeFieldName,
} from '../lib/employee/types';
import EmployeeFormSection from './EmployeeFormSection';
import EmployeeRadioGroupField from './EmployeeRadioGroupField';

const yesNoOptions = [
  { label: 'Yes', value: 'YES' },
  { label: 'No', value: 'NO' },
];

type ContractSettingsSectionProps = {
  form: AddEmployeeFormData;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const ContractSettingsSection = ({
  form,
  onChange,
}: ContractSettingsSectionProps) => {
  return (
    <EmployeeFormSection title="Contract Settings">
      <div className="space-y-4">
        <div>
          <p className="text-[12px] font-normal leading-5 text-[#4b5565]">
            Annual Vacation Days
          </p>

          <div className="mt-2 flex items-center gap-3">
            <input
              type="text"
              value={form.annualVacationDays}
              onChange={(event) =>
                onChange('annualVacationDays', event.target.value)
              }
              className="h-[32px] w-[58px] rounded-[4px] border border-[#c4cad6] bg-white px-3 text-[12px] text-[#0f172a] outline-none"
            />
            <span className="text-[12px] text-[#4b5565]">days</span>
          </div>
        </div>

        <EmployeeRadioGroupField
          label="KPI Eligible"
          name="kpiEligible"
          value={form.kpiEligible}
          options={yesNoOptions}
          onChange={onChange}
        />

        <EmployeeRadioGroupField
          label="Salary from Company"
          name="salaryFromCompany"
          value={form.salaryFromCompany}
          options={yesNoOptions}
          onChange={onChange}
        />
      </div>
    </EmployeeFormSection>
  );
};

export default ContractSettingsSection;
