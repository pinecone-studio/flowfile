import type { DashboardStat } from './dashboard.types';
import { DashboardCard } from './DashboardCard';

export function DashboardStatCard({ label, value }: DashboardStat) {
  return (
    <DashboardCard title={label} className="min-h-[266px]">
      <div className="pt-[28px] text-[88px] font-semibold leading-none tracking-[-0.05em] text-[#111827]">
        {value}
      </div>
    </DashboardCard>
  );
}
