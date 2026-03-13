type EmployeeFieldLabelProps = {
  label?: string;
  name: string;
  required?: boolean;
};

const EmployeeFieldLabel = ({
  label,
  name,
  required = false,
}: EmployeeFieldLabelProps) => {
  if (!label) {
    return null;
  }

  return (
    <label
      htmlFor={name}
      className="text-[12px] font-normal leading-5 text-[#4b5565]"
    >
      {label}
      {required ? <span className="ml-1 text-[#ef4444]">*</span> : null}
    </label>
  );
};

export default EmployeeFieldLabel;
