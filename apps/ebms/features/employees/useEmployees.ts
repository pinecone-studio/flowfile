'use client';

import { useEffect, useState } from 'react';
import { getEmployees } from '../../lib/employee/api';
import type { EmployeeRecord } from './employeePage.types';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Failed to load employees';

const readEmployees = async (): Promise<EmployeeRecord[]> => {
  const employees = await getEmployees();

  return employees.map((employee) => ({
    ...employee,
    email: employee.email ?? null,
    imageUrl: employee.imageUrl ?? null,
    hireDate: employee.hireDate ?? null,
    terminationDate: employee.terminationDate ?? null,
    department: employee.department ?? null,
    branch: employee.branch ?? null,
    level: employee.level ?? null,
  }));
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadEmployees = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await readEmployees();
        if (!active) {
          return;
        }

        setEmployees(data);
      } catch (error) {
        if (active) {
          setEmployees([]);
          setError(getErrorMessage(error));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadEmployees();

    return () => {
      active = false;
    };
  }, []);

  return { employees, isLoading, error };
};
