export type ApiEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  imageUrl: string | null;
  hireDate: string | null;
  numberOfVacationDays: number | null;
  terminationDate: string | null;
  status: string;
  github: string | null;
  department: string | null;
  branch: string | null;
  employeeCode: string;
  level: string | null;
  isKpi: boolean;
  isSalaryCompany: boolean;
  birthDayAndMonth: string | null;
};

export type ApiAction = {
  actionName: string;
  triggerFieldsJson: string;
  isActive: boolean;
};

export type ApiDocument = {
  id: string;
  employeeId: string;
  documentType: string;
  fileName: string;
  fileUrl: string | null;
  status: string;
  createdAt: string;
};

export type ApiAuditLog = {
  id: string;
  jobId: string | null;
  actionName: string;
  eventType: string;
  status: string;
  message: string | null;
  createdAt: string;
};

type TriggerActionInput = {
  employeeId: string;
  action: string;
  payload?: Record<string, unknown>;
  requestedByEmail?: string;
};

const apiUnavailableMessage =
  'Backend is not reachable. Start apps/worker on http://127.0.0.1:8787 or set NEXT_PUBLIC_API_BASE_URL.';

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return normalizeBaseUrl(configuredBaseUrl);
  }

  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:8787';
  }

  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://127.0.0.1:8787';
  }

  return normalizeBaseUrl(window.location.origin);
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      throw new Error(
        errorBody?.message || `Request failed with status ${response.status}`,
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(apiUnavailableMessage);
    }

    throw error;
  }
}

export async function fetchEmployeeDetailData(employeeId: string) {
  const employee = await requestJson<ApiEmployee>(`/employees/${employeeId}`);
  const [actions, documents, auditLogs] = await Promise.all([
    requestJson<ApiAction[]>('/api/v1/actions'),
    requestJson<ApiDocument[]>(`/api/v1/documents/${employeeId}`),
    requestJson<ApiAuditLog[]>(`/api/v1/audit?employeeId=${employeeId}`),
  ]);

  return { employee, actions, documents, auditLogs };
}

export async function triggerEmployeeAction(input: TriggerActionInput) {
  return requestJson<{
    jobId?: string;
    status: string;
    documentsQueued: number;
    reviewRequests: Array<{ id: string; reviewerEmail: string; reviewUrl: string }>;
  }>('/api/v1/trigger', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
