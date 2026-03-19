import { FilterSelect } from '../showcase/components/FilterSelect';
import { MetricLegend } from '../showcase/components/MetricLegend';
import { SearchField } from '../showcase/components/SearchField';
import { EmployeePreviewCard } from '../showcase/showcase.ui';
import type { EmployeeDto } from '../../lib/employee/types';
import { mapEmployeeToPreviewCardData } from '../../lib/employee/mappers';

type EmployeePageProps = {
  employees?: EmployeeDto[];
};

export default function EmployeePage({ employees = [] }: EmployeePageProps) {
  const employeeCards = employees.map(mapEmployeeToPreviewCardData);

  const activeCount = employees.filter(
    (employee) => employee.status === 'ACTIVE',
  ).length;

  const inactiveCount = employees.filter(
    (employee) => employee.status === 'INACTIVE',
  ).length;

  return (
    <section className="mx-auto w-full max-w-[1548px] pb-10">
      <h1 className="text-[36px] font-semibold tracking-[-0.03em] text-white md:text-[38px]">
        Employee
      </h1>

      <MetricLegend
        items={[
          { label: 'Active', value: String(activeCount), color: '#23cd35' },
          { label: 'Inactive', value: String(inactiveCount), color: '#83838d' },
        ]}
      />

      <div className="mt-12 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <SearchField
          placeholder="Search Employees by name, ID, Department, or Position..."
          className="max-w-[540px]"
        />

        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <FilterSelect withPrefix="Filter:" label="Latest Action" />
          <FilterSelect label="Status" />
          <FilterSelect label="Role" />
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 2xl:grid-cols-4">
        {employeeCards.map((record) => (
          <EmployeePreviewCard key={record.id} record={record} />
        ))}
      </div>
    </section>
  );
}
