import type { LucideIcon } from 'lucide-react';

type EmployeeStatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export const EmployeeStatCard = ({
  title,
  value,
  icon: Icon,
}: EmployeeStatCardProps) => {
  return (
    <div className="flex min-h-[62px] items-start justify-between rounded-[10px] border border-[#c7cedd] bg-white px-[22px] py-[11px]">
      <div>
        <p className="text-[13px] font-medium text-[#4b5565]">{title}</p>
        <p className="mt-[2px] text-[15px] font-semibold leading-6 text-[#111827]">
          {value}
        </p>
      </div>

      <Icon className="mt-1 h-[18px] w-[18px] text-[#111827]" strokeWidth={1.8} />
    </div>
  );
};
