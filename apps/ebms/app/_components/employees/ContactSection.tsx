import type {
  AddEmployeeFormData,
  AddEmployeeFormErrors,
  AddEmployeeFieldName,
} from '../lib/employee/types';
import EmployeeFormField from './EmployeeFormField';
import EmployeeFormSection from './EmployeeFormSection';

type ContactSectionProps = {
  form: AddEmployeeFormData;
  errors: AddEmployeeFormErrors;
  onChange: (name: AddEmployeeFieldName, value: string) => void;
};

const ContactSection = ({ form, errors, onChange }: ContactSectionProps) => {
  return (
    <EmployeeFormSection title="Contact" className="h-full">
      <EmployeeFormField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        error={errors.email}
        placeholder="example@gmail.com"
        onChange={onChange}
      />
    </EmployeeFormSection>
  );
};

export default ContactSection;
