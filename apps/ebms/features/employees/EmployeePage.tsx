'use client';

import { useDeferredValue, useState } from 'react';
import { FilterSelect } from '../showcase/components/FilterSelect';
import { MetricLegend } from '../showcase/components/MetricLegend';
import { SearchField } from '../showcase/components/SearchField';
import { EmployeePreviewCard } from '../showcase/showcase.ui';
import {
  buildEmployeePageData,
  buildFilterOptions,
  filterEmployeeCards,
} from './employeePage.helpers';
import { useEmployees } from './useEmployees';

const LoadingState = () => (
  <div className="rounded-[28px] border border-[#274579]/60 bg-[#142449]/72 p-8 text-[18px] text-[#d7dff0]">
    Loading employees...
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-[28px] border border-[#6b2e45]/60 bg-[#30131f]/80 p-8 text-[18px] text-[#ffd6df]">
    {message}
  </div>
);

const EmptyState = () => (
  <div className="rounded-[28px] border border-[#274579]/60 bg-[#142449]/72 p-8 text-[18px] text-[#d7dff0]">
    No employees matched your filters.
  </div>
);

export default function EmployeePage() {
  const { employees, isLoading, error } = useEmployees();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [role, setRole] = useState('all');
  const [latestAction, setLatestAction] = useState('all');
  const [department, setDepartment] = useState('all');
  const [branch, setBranch] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const deferredSearch = useDeferredValue(search);
  const pageData = buildEmployeePageData(employees);
  const filteredCards = filterEmployeeCards(employees, pageData.employeeCards, {
    search: deferredSearch,
    status,
    role,
    latestAction,
    department,
    branch,
    sortBy,
  });

  return (
    <section className="mx-auto w-full max-w-[1548px] pb-10">
      <h1 className="text-[36px] font-semibold tracking-[-0.03em] text-white md:text-[38px]">
        Employee
      </h1>

      <MetricLegend
        items={[
          { label: 'Active', value: String(pageData.activeCount), color: '#23cd35' },
          { label: 'Inactive', value: String(pageData.inactiveCount), color: '#83838d' },
        ]}
      />

      <div className="mt-12 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <SearchField
          placeholder="Search Employees by name, ID, Department, or Position..."
          className="max-w-[540px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="flex flex-wrap items-center justify-end gap-3 md:gap-4">
          <FilterSelect
            withPrefix="Filter:"
            label="Latest Action"
            options={buildFilterOptions(
              pageData.employeeCards.map((employee) => employee.latestAction),
              'Latest Action',
            )}
            value={latestAction}
            onValueChange={setLatestAction}
          />
          <FilterSelect
            label="Status"
            options={buildFilterOptions(
              pageData.employeeCards.map((employee) => employee.status),
              'Status',
            )}
            value={status}
            onValueChange={setStatus}
          />
          <FilterSelect
            label="Role"
            options={buildFilterOptions(
              pageData.employeeCards.map((employee) => employee.role),
              'Role',
            )}
            value={role}
            onValueChange={setRole}
          />
          <FilterSelect
            label="Department"
            options={buildFilterOptions(
              employees.map((employee) => employee.department),
              'Department',
            )}
            value={department}
            onValueChange={setDepartment}
          />
          <FilterSelect
            label="Branch"
            options={buildFilterOptions(
              employees.map((employee) => employee.branch),
              'Branch',
            )}
            value={branch}
            onValueChange={setBranch}
          />
          <FilterSelect
            label="Sort"
            options={[
              { label: 'Name A-Z', value: 'name-asc' },
              { label: 'Name Z-A', value: 'name-desc' },
              { label: 'Newest', value: 'date-newest' },
              { label: 'Oldest', value: 'date-oldest' },
            ]}
            value={sortBy}
            onValueChange={setSortBy}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 2xl:grid-cols-4">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && filteredCards.length === 0 ? <EmptyState /> : null}
        {!isLoading && !error
          ? filteredCards.map((record) => (
              <EmployeePreviewCard key={record.id} record={record} />
            ))
          : null}
      </div>
    </section>
  );
}
