<<<<<<< Updated upstream
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
=======
import Link from 'next/link';
import { employeeCards } from '../flowfile/flowfile.data';
import {
  FilterChip,
  MetricLegend,
  PageDivider,
  PageShell,
  PageTitle,
  SearchBar,
  StatusPill,
} from '../flowfile/flowfile.ui';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    <section className="mx-auto w-full max-w-[1548px] pb-10">
      <h1 className="text-[36px] font-semibold tracking-[-0.03em] text-white md:text-[38px]">
        Employee
      </h1>

      <MetricLegend
        items={[
          {
            label: 'Active',
            value: String(pageData.activeCount),
            color: '#23cd35',
          },
          {
            label: 'Inactive',
            value: String(pageData.inactiveCount),
            color: '#83838d',
          },
        ]}
=======
    <PageShell>
      <PageTitle
        title="Employees"
        subtitle={
          <MetricLegend
            items={[
              { label: 'Active', value: '24', color: '#22cd35' },
              { label: 'Inactive', value: '8', color: '#8b857a' },
            ]}
          />
        }
>>>>>>> Stashed changes
      />

      <PageDivider />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <SearchBar
          placeholder="Search Employees by name, ID, Department, or Position..."
<<<<<<< Updated upstream
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
        {!isLoading && !error && filteredCards.length === 0 ? (
          <EmptyState />
        ) : null}
        {!isLoading && !error
          ? filteredCards.map((record) => (
              <EmployeePreviewCard key={record.id} record={record} />
            ))
          : null}
=======
          className="max-w-[598px]"
        />

        <div className="flex flex-wrap items-center gap-5">
          <FilterChip label="Latest Action" prefix="Filter:" />
          <FilterChip label="Status" />
          <FilterChip label="Role" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 xl:justify-between">
        {employeeCards.map((record) => (
          <article
            key={record.id}
            className="flex h-[434px] w-[274px] flex-col rounded-[36px] border border-white/5 bg-[linear-gradient(180deg,rgba(27,49,92,0.96)_0%,rgba(21,36,65,0.96)_100%)] p-[10px_12px] shadow-[0_26px_54px_rgba(5,10,24,0.24)]"
          >
            <div className="relative h-[250px] overflow-hidden rounded-[28px]">
              <img
                src={record.image}
                alt={record.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,26,0)_44%,rgba(8,14,26,0.08)_70%,rgba(0,0,0,0.88)_100%)]" />
              <StatusPill
                label={record.status}
                tone={record.statusTone}
                compact
                className="absolute left-4 top-4"
              />

              <div className="absolute inset-x-5 bottom-5">
                <p className="text-[16px] leading-5 text-[#ebeff9]">{record.role}</p>
                <h2 className="mt-2 text-[22px] font-semibold leading-7 tracking-[-0.02em] text-white">
                  {record.name}
                </h2>
              </div>
            </div>

            <div className="flex flex-1 flex-col px-[6px] pt-5">
              <p className="text-[16px] text-[#dbe3f3]">
                Email:{' '}
                <span className="font-medium text-[#eef3ff]">{record.email}</span>
              </p>

              <p className="mt-5 text-[16px] text-[#cfd7ea]">Latest Action:</p>

              <div className="mt-3 flex items-center gap-3">
                <StatusPill
                  label={record.latestAction}
                  tone={record.actionTone}
                  className="h-[46px]"
                />
                <span className="text-[16px] font-medium text-[#ecf2ff]">
                  {record.latestDate}
                </span>
              </div>

              <Link
                href={record.href}
                className="mt-auto flex h-[68px] items-center justify-center rounded-[26px] bg-[#21407b] text-[18px] font-semibold text-[#f5f8ff] transition hover:bg-[#295196]"
              >
                View Profile
              </Link>
            </div>
          </article>
        ))}
>>>>>>> Stashed changes
      </div>
    </PageShell>
  );
}
