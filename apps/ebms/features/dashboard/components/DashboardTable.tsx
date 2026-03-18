import { activityStatusStyles } from './dashboardData';
import type { ActivityRow } from './dashboard.types';
import { DashboardCard } from './DashboardCard';

type DashboardTableProps = {
  title: string;
  rows: ActivityRow[];
};

export function DashboardTable({ title, rows }: DashboardTableProps) {
  return (
    <DashboardCard title={title} className="min-h-[568px]">
      <div className="mt-[18px] border-t border-[#e5e9f0] pt-[18px]">
        <div className="grid grid-cols-[1.5fr_1.3fr_0.8fr_0.9fr] gap-4 rounded-[4px] bg-[#f3f5f8] px-[12px] py-[10px] text-[15px] text-[#4b5563]">
          <span>Employee</span>
          <span>Event</span>
          <span>Time</span>
          <span>Status</span>
        </div>

        <div className="pt-[6px]">
          {rows.map((row) => (
            <div
              key={`${title}-${row.event}-${row.time}`}
              className="grid grid-cols-[1.5fr_1.3fr_0.8fr_0.9fr] gap-4 border-b border-[#edf0f5] px-[12px] py-[10px] text-[15px] text-[#1f2937] last:border-b-0"
            >
              <span className="truncate">{row.employee}</span>
              <span>{row.event}</span>
              <span>{row.time}</span>
              <span>
                <span
                  className={`inline-flex min-w-[96px] items-center justify-center rounded-full px-[14px] py-[4px] text-[14px] font-medium ${activityStatusStyles[row.status]}`}
                >
                  {row.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
