import type { EmployeeDto } from './types';

export async function getEmployees(): Promise<EmployeeDto[]> {
  const response = await fetch('/api/employees', {
    method: 'GET',
    cache: 'no-store',
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to fetch employees: ${response.status} ${response.statusText} | ${rawText}`,
    );
  }

  const data: unknown = rawText ? JSON.parse(rawText) : [];

  if (!Array.isArray(data)) {
    throw new Error(
      `Employees response is not an array: ${JSON.stringify(data)}`,
    );
  }

  return data as EmployeeDto[];
}
