'use client';

import { useEffect, useState } from 'react';
import type { EmployeeQueryResponse, EmployeeRecord } from './employeePage.types';

const EMPLOYEES_QUERY = `
  query GetEmployees {
    employees {
      id
      firstName
      lastName
      email
      imageUrl
      hireDate
      terminationDate
      status
      department
      branch
      employeeCode
      level
      updatedAt
    }
  }
`;

const graphQLEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
  `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8787'}/graphql`;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Failed to load employees';

const readEmployees = async (
  signal: AbortSignal,
): Promise<EmployeeRecord[]> => {
  const response = await fetch(graphQLEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: EMPLOYEES_QUERY }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Employees query failed with ${response.status}`);
  }

  const payload = (await response.json()) as EmployeeQueryResponse;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'Employees query failed');
  }

  return payload.data?.employees ?? [];
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadEmployees = async () => {
      setIsLoading(true);
      setError(null);

      try {
        setEmployees(await readEmployees(controller.signal));
      } catch (error) {
        if (!controller.signal.aborted) {
          setEmployees([]);
          setError(getErrorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadEmployees();

    return () => controller.abort();
  }, []);

  return { employees, isLoading, error };
};
