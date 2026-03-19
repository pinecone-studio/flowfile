import type { EmployeeCardRecord, Tone } from '../showcase/showcase.data';
import type {
  EmployeeFilters,
  EmployeePageData,
  EmployeeRecord,
} from './employeePage.types';

const formatDate = (value: string | null) => {
  if (!value) {
    return '(No date)';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '(No date)';
  }

  return `(${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)})`;
};

const getStatusTone = (status: string): Tone =>
  status === 'ACTIVE' ? 'active' : 'inactive';

const getLatestAction = (employee: EmployeeRecord) => {
  if (employee.terminationDate || employee.status === 'TERMINATED') {
    return { label: 'Terminate', tone: 'terminate' as Tone };
  }

  if (employee.status === 'INACTIVE') {
    return { label: 'Inactive', tone: 'inactive' as Tone };
  }

  return {
    label: employee.hireDate ? 'Onboarding' : 'Active',
    tone: 'onboarding' as Tone,
  };
};

const matchesSearch = (
  employee: EmployeeRecord,
  card: EmployeeCardRecord,
  search: string,
) => {
  if (!search) {
    return true;
  }

  return [
    card.name,
    card.email,
    card.role,
    card.status,
    card.latestAction,
    employee.employeeCode,
    employee.department ?? '',
    employee.level ?? '',
    employee.branch ?? '',
  ].some((value) => value.toLowerCase().includes(search));
};

const matchesValue = (current: string | null | undefined, expected: string) =>
  expected === 'all' || (current ?? '') === expected;

const getComparableDate = (employee: EmployeeRecord) =>
  employee.terminationDate || employee.updatedAt || employee.hireDate || '';

const compareText = (left: string, right: string) => left.localeCompare(right);

const compareDate = (left: string, right: string) =>
  new Date(left).getTime() - new Date(right).getTime();

const sortEmployees = (
  items: Array<{ employee: EmployeeRecord; card: EmployeeCardRecord }>,
  sortBy: string,
) => {
  const sortedItems = [...items];

  sortedItems.sort((left, right) => {
    if (sortBy === 'name-desc') {
      return compareText(right.card.name, left.card.name);
    }

    if (sortBy === 'date-newest') {
      return compareDate(
        getComparableDate(right.employee),
        getComparableDate(left.employee),
      );
    }

    if (sortBy === 'date-oldest') {
      return compareDate(
        getComparableDate(left.employee),
        getComparableDate(right.employee),
      );
    }

    return compareText(left.card.name, right.card.name);
  });

  return sortedItems;
};

export const toEmployeeCard = (employee: EmployeeRecord): EmployeeCardRecord => {
  const latestAction = getLatestAction(employee);
  const roleParts = [employee.department, employee.level].filter(Boolean);

  return {
    id: employee.id,
    status: employee.status === 'ACTIVE' ? 'Active' : employee.status,
    statusTone: getStatusTone(employee.status),
    image: employee.imageUrl || '/image%205.svg',
    role: roleParts.join(' - ') || employee.branch || 'Team Member',
    name: `${employee.firstName} ${employee.lastName}`.trim(),
    email: employee.email || employee.employeeCode,
    latestAction: latestAction.label,
    actionTone: latestAction.tone,
    latestDate: formatDate(getComparableDate(employee)),
  };
};

export const buildEmployeePageData = (
  employees: EmployeeRecord[],
): EmployeePageData => {
  const activeCount = employees.filter(
    (employee) => employee.status === 'ACTIVE',
  ).length;

  return {
    employeeCards: employees.map(toEmployeeCard),
    activeCount,
    inactiveCount: employees.length - activeCount,
  };
};

export const filterEmployeeCards = (
  employees: EmployeeRecord[],
  employeeCards: EmployeeCardRecord[],
  filters: EmployeeFilters,
) => {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const filteredItems = employeeCards
    .map((card, index) => ({ card, employee: employees[index] }))
    .filter(
      (
        item,
      ): item is {
        card: EmployeeCardRecord;
        employee: EmployeeRecord;
      } => item.employee !== undefined,
    )
    .filter(
      ({ employee, card }) =>
        matchesSearch(employee, card, normalizedSearch) &&
        matchesValue(card.status, filters.status) &&
        matchesValue(card.role, filters.role) &&
        matchesValue(card.latestAction, filters.latestAction) &&
        matchesValue(employee.department, filters.department) &&
        matchesValue(employee.branch, filters.branch),
    );

  return sortEmployees(filteredItems, filters.sortBy).map((item) => item.card);
};

export const buildFilterOptions = (
  items: Array<string | null | undefined>,
  fallbackLabel: string,
) => [
  { label: fallbackLabel, value: 'all' },
  ...Array.from(new Set(items.filter(Boolean)))
    .map((value) => String(value))
    .map((value) => ({ label: value, value })),
];
