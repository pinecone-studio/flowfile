import type { EmployeeDto } from './types';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8787'
).replace(/\/+$/, '');

export async function getEmployees(): Promise<EmployeeDto[]> {
  const url = `${API_BASE_URL}/employees`;

  const response = await fetch(url, {
    method: 'GET',
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
