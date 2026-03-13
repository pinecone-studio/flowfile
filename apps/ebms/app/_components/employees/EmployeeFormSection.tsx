import type { ReactNode } from 'react';

type EmployeeFormSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const sectionBaseClassName =
  'rounded-[4px] bg-white px-6 pb-5 pt-6';

const EmployeeFormSection = ({
  title,
  children,
  className = '',
}: EmployeeFormSectionProps) => {
  return (
    <section className={`${sectionBaseClassName} ${className}`.trim()}>
      <h3 className="border-b border-[#cfd5e0] pb-4 text-[17px] font-medium leading-[27px] text-[#111827]">
        {title}
      </h3>
      <div className="pt-4">{children}</div>
    </section>
  );
};

export default EmployeeFormSection;
