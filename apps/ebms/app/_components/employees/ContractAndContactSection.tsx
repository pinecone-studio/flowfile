import type {
  AddEmployeeFieldName,
  AddEmployeeFormData,
  AddEmployeeFormErrors,
} from '../lib/employee/types';
import InlineRadioField from './InlineRadioField';
import InlineTextField from './InlineTextField';

const yesNoOptions = [
  { label: 'Yes', value: 'YES' },
  { label: 'No', value: 'NO' },
];

type ContractAndContactSectionProps = {
  form: AddEmployeeFormData;
  errors: AddEmployeeFormErrors;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const subsectionTitleClassName =
  'border-b border-[#cfd5e0] pb-4 text-[17px] font-medium leading-[27px] text-[#111827]';

const ContractAndContactSection = ({
  form,
  errors,
  onChange,
}: ContractAndContactSectionProps) => {
  return (
    <section className="h-[193px] rounded-[4px] bg-white px-6 pb-5 pt-6">
      <div className="grid w-[572px] grid-cols-[243px_243px] gap-x-[86px]">
        <div className="space-y-[20px]">
          <h3 className={subsectionTitleClassName}>Contract Settings</h3>

          <div className="flex items-center gap-[14px]">
            <p className="w-[108px] text-[14px] leading-[27px] text-[#4b5565]">
              Annual Vacation Days
            </p>

            <input
              type="text"
              value={form.annualVacationDays}
              onChange={(event) =>
                onChange('annualVacationDays', event.target.value)
              }
              className="h-[32px] w-[92px] rounded-[4px] border border-[#c4cad6] bg-white px-3 text-[12px] text-[#0f172a] outline-none"
            />
            <span className="text-[14px] leading-[27px] text-[#4b5565]">
              days
            </span>
          </div>

          <InlineRadioField
            label="KPI Eligible"
            name="kpiEligible"
            value={form.kpiEligible}
            options={yesNoOptions}
            labelWidthClassName="w-[108px]"
            optionsClassName="gap-[16px]"
            onChange={onChange}
          />

          <InlineRadioField
            label="Salary from Company"
            name="salaryFromCompany"
            value={form.salaryFromCompany}
            options={yesNoOptions}
            labelWidthClassName="w-[108px]"
            optionsClassName="gap-[16px]"
            onChange={onChange}
          />
        </div>

        <div className="space-y-[20px]">
          <h3 className={subsectionTitleClassName}>Contact</h3>

          <div className="pt-2">
            <InlineTextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              error={errors.email}
              placeholder="example@gmail.com"
              labelWidthClassName="w-[70px]"
              inputClassName="w-[159px]"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractAndContactSection;
