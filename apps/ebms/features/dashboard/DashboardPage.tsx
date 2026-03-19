import {
  dashboardStats,
  recentDocuments,
  recentLifecycleEvents,
} from './components/dashboardData';
import { DashboardCard } from './components/DashboardCard';
import { DashboardStatCard } from './components/DashboardStatCard';
import { DashboardTable } from './components/DashboardTable';
import { DocumentTable } from './components/DocumentTable';

function DashboardPage() {
  return (
    <section className="min-h-full bg-[#f7f8fb] px-[28px] py-[30px] md:px-[36px] md:py-[28px]">
      <div className="mx-auto flex max-w-[1540px] flex-col gap-[52px]">
        <div className="grid gap-[44px] xl:grid-cols-[minmax(0,1fr)_268px]">
          <DashboardCard title="Document Pipeline" className="min-h-[586px]">
            <DocumentTable />
          </DashboardCard>
          <div className="grid gap-[44px] sm:grid-cols-2 xl:grid-cols-1">
            {dashboardStats.map((stat) => (
              <DashboardStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-[48px] xl:grid-cols-2">
          <DashboardTable
            title="Recent Documents Generated"
            rows={recentDocuments}
          />
          <DashboardTable
            title="Recent Lifecycle Events"
            rows={recentLifecycleEvents}
          />
        </div>
      </div>
    </section>
  );
}
export default DashboardPage;
