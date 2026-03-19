import { useEffect, useMemo, useState } from 'react';
import {
  cancelDocumentJob,
  fetchDocumentsDashboard,
  retryDocumentJob,
} from '../../../features/documents/documents.api';
import {
  buildDocumentsPageModel,
  type DocumentsCategoryKey,
} from '../../../features/documents/documents.transform';

type DocumentsDashboardResult = Awaited<ReturnType<typeof fetchDocumentsDashboard>>;

type DocumentsState = {
  employees: DocumentsDashboardResult['employees'];
  jobs: DocumentsDashboardResult['jobs'];
  documents: DocumentsDashboardResult['generatedDocuments'];
  reviewRequests: DocumentsDashboardResult['reviewRequests'];
  auditLogs: DocumentsDashboardResult['auditLogs'];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
};

const initialState: DocumentsState = {
  employees: [],
  jobs: [],
  documents: [],
  reviewRequests: [],
  auditLogs: [],
  loading: true,
  error: null,
  refreshing: false,
};

export const useDocuments = () => {
  const [search, setSearch] = useState('');
  const [categoryKey, setCategoryKey] = useState<DocumentsCategoryKey>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState<DocumentsState>(initialState);

  useEffect(() => {
    let active = true;

    setState((current) => ({
      ...current,
      loading: current.jobs.length === 0,
      refreshing: current.jobs.length > 0,
      error: null,
    }));

    fetchDocumentsDashboard()
      .then((result) => {
        if (!active) {
          return;
        }

        setState({
          employees: result.employees,
          jobs: result.jobs,
          documents: result.generatedDocuments,
          reviewRequests: result.reviewRequests,
          auditLogs: result.auditLogs,
          loading: false,
          error: null,
          refreshing: false,
        });
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setState((current) => ({
          ...current,
          loading: false,
          refreshing: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load document workflows.',
        }));
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const model = useMemo(
    () =>
      buildDocumentsPageModel({
        employees: state.employees,
        jobs: state.jobs,
        documents: state.documents,
        reviewRequests: state.reviewRequests,
        auditLogs: state.auditLogs,
        search,
        categoryKey,
      }),
    [
      categoryKey,
      search,
      state.auditLogs,
      state.documents,
      state.employees,
      state.jobs,
      state.reviewRequests,
    ],
  );

  return {
    ...model,
    loading: state.loading,
    refreshing: state.refreshing,
    error: state.error,
    search,
    categoryKey,
    setSearch,
    setCategoryKey,
    refresh: () => setRefreshKey((current) => current + 1),
    retryJob: async (employeeId: string, actionName: string) => {
      await retryDocumentJob({ employeeId, actionName });
      setRefreshKey((current) => current + 1);
    },
    cancelJob: async (jobId: string) => {
      await cancelDocumentJob(jobId);
      setRefreshKey((current) => current + 1);
    },
  };
};
