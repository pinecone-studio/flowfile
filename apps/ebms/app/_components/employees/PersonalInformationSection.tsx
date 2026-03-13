import type {
  AddEmployeeFormData,
  AddEmployeeFormErrors,
  AddEmployeeFieldName,
} from '../lib/employee/types';
import EmployeeFormField from './EmployeeFormField';
import EmployeeFormSection from './EmployeeFormSection';
import EmployeeSelectField from './EmployeeSelectField';

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, index) => ({
  label,
  value: String(index + 1).padStart(2, '0'),
}));

const dayOptions = Array.from({ length: 31 }, (item, index) => {
  void item;

  return {
    label: String(index + 1),
    value: String(index + 1).padStart(2, '0'),
  };
});

type PersonalInformationSectionProps = {
  form: AddEmployeeFormData;
  errors: AddEmployeeFormErrors;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const labelClassName = 'text-[14px] leading-[27px] text-[#4b5565]';

const PersonalInformationSection = ({
  form,
  errors,
  onChange,
}: PersonalInformationSectionProps) => {
  return (
    <EmployeeFormSection title="Personal Information" className="h-[265px]">
      <div className="w-[572px] space-y-[22px]">
        <div className="space-y-[10px]">
          <p className={labelClassName}>
            Employee Name (Mongolian)
            <span className="ml-1 text-[#ef4444]">*</span>
          </p>

          <div className="grid grid-cols-[276px_276px] gap-x-5">
            <EmployeeFormField
              label=""
              name="firstName"
              value={form.firstName}
              error={errors.firstName}
              placeholder="First Name"
              inputClassName="w-[276px]"
              onChange={onChange}
            />
            <EmployeeFormField
              label=""
              name="lastName"
              value={form.lastName}
              error={errors.lastName}
              placeholder="Last Name"
              inputClassName="w-[276px]"
              onChange={onChange}
            />
          </div>
        </div>

        <div className="space-y-[10px]">
          <p className={labelClassName}>Employee Name (English)</p>

          <div className="grid grid-cols-[276px_276px] gap-x-5">
            <EmployeeFormField
              label=""
              name="firstNameEng"
              value={form.firstNameEng}
              error={errors.firstNameEng}
              placeholder="First Name"
              inputClassName="w-[276px]"
              onChange={onChange}
            />
            <EmployeeFormField
              label=""
              name="lastNameEng"
              value={form.lastNameEng}
              error={errors.lastNameEng}
              placeholder="Last Name"
              inputClassName="w-[276px]"
              onChange={onChange}
            />
          </div>
        </div>

        <div className="flex items-start gap-5">
          <p className="w-[157px] pt-[2px] text-[14px] leading-[32px] text-[#4b5565]">
            Birth Day &amp; Month
          </p>

          <div className="flex items-start gap-[18px]">
            <EmployeeSelectField
              label=""
              name="birthMonth"
              value={form.birthMonth}
              error={errors.birthMonth}
              options={monthOptions}
              placeholder="Month"
              containerClassName="w-[96px]"
              selectClassName="w-[96px] pr-8"
              onChange={onChange}
            />
            <EmployeeSelectField
              label=""
              name="birthDay"
              value={form.birthDay}
              error={errors.birthDay}
              options={dayOptions}
              placeholder="Day"
              containerClassName="w-[96px]"
              selectClassName="w-[96px] pr-8"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </EmployeeFormSection>
  );
};

export default PersonalInformationSection;
