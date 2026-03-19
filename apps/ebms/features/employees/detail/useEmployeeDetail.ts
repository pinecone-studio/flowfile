'use client';

import { useEffect, useState } from 'react';
import { fetchEmployeeDetailData } from './employeeDetail.api';
import type {
  ApiAction,
  ApiAuditLog,
  ApiDocument,
  ApiEmployee,
} from './employeeDetail.api';

type EmployeeDetailState = {
  employee: ApiEmployee | null;
  actions: ApiAction[];
  documents: ApiDocument[];
  auditLogs: ApiAuditLog[];
  loading: boolean;
  error: string | null;
};

const initialState: EmployeeDetailState = {
  employee: null,
  actions: [],
  documents: [],
  auditLogs: [],
  loading: true,
  error: null,
};

export function useEmployeeDetail(employeeId: string, refreshKey: number) {
  const [state, setState] = useState<EmployeeDetailState>(initialState);

  useEffect(() => {
    let active = true;

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    fetchEmployeeDetailData(employeeId)
      .then((result) => {
        if (!active) {
          return;
        }

        setState({
          employee: result.employee,
          actions: result.actions,
          documents: result.documents,
          auditLogs: result.auditLogs,
          loading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load employee details',
        }));
      });

    return () => {
      active = false;
    };
  }, [employeeId, refreshKey]);

  return state;
}
