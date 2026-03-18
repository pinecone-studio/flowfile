import type { ReactNode } from 'react';

type DashboardCardProps = {
  title: string;
  children?: ReactNode;
  className?: string;
};

export function DashboardCard({
  title,
  children,
  className = '',
}: DashboardCardProps) {
  return (
    <section
      className={`flex h-full flex-col rounded-[24px] border border-[#d8dfe9] bg-white p-[30px] shadow-[0_10px_30px_rgba(15,23,42,0.04)] ${className}`}
    >
      <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[#4b5563]">
        {title}
      </h2>
      {children}
    </section>
  );
}
