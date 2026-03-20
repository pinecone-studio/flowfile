import { getEmployees } from '../../lib/employee/api';
import { requestGraphQL, requestJson } from '../../lib/api/client';

export type ApiEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  imageUrl: string | null;
  department: string | null;
  branch: string | null;
  employeeCode: string;
  status: string;
};

export type ApiJob = {
  id: string;
  employeeId: string;
  actionName: string;
  status: string;
  documentsExpected: number;
  documentsGenerated: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type ApiGeneratedDocument = {
  id: string;
  jobId: string;
  employeeId: string;
  actionName: string;
  documentType: string;
  templateName: string;
  fileName: string;
  storagePath: string;
  fileUrl: string | null;
  generationOrder: number;
  status: string;
  createdAt: string;
  signatureImageUrl: string | null;
  signMethod: string | null;
  signedBy: string | null;
  signedAt: string | null;
  finalizedAt: string | null;
};

export type ApiReviewRequest = {
  id: string;
  jobId: string;
  documentId: string;
  reviewerEmail: string;
  reviewerName: string | null;
  signerRole: string;
  signOrder: number;
  reviewToken: string;
  status: string;
  openedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
};

export type ApiAuditLog = {
  id: string;
  jobId: string | null;
  employeeId: string;
  actionName: string;
  eventType: string;
  status: string;
  message: string | null;
  createdAt: string;
  eventPayloadJson: string | null;
};

type DocumentsDashboardResponse = {
  employees: ApiEmployee[];
  jobs: ApiJob[];
  generatedDocuments: ApiGeneratedDocument[];
  reviewRequests: ApiReviewRequest[];
  auditLogs: ApiAuditLog[];
};

const documentsDashboardQuery = `
  query DocumentsDashboard {
    employees {
      id
      firstName
      lastName
      email
      imageUrl
      department
      branch
      employeeCode
      status
    }
    jobs {
      id
      employeeId
      actionName
      status
      documentsExpected
      documentsGenerated
      errorMessage
      createdAt
      updatedAt
      completedAt
    }
    generatedDocuments {
      id
      jobId
      employeeId
      actionName
      documentType
      templateName
      fileName
      storagePath
      fileUrl
      generationOrder
      status
      createdAt
      signatureImageUrl
      signMethod
      signedBy
      signedAt
      finalizedAt
    }
    reviewRequests {
      id
      jobId
      documentId
      reviewerEmail
      reviewerName
      signerRole
      signOrder
      reviewToken
      status
      openedAt
      approvedAt
      rejectedAt
    }
    auditLogs {
      id
      jobId
      employeeId
      actionName
      eventType
      status
      message
      createdAt
      eventPayloadJson
    }
  }
`;

export async function fetchDocumentsDashboard() {
<<<<<<< Updated upstream
  const dashboard = await requestGraphQL<DocumentsDashboardResponse>(
    documentsDashboardQuery,
  );

  return {
    employees: dashboard.employees,
=======
  const [employees, dashboard] = await Promise.all([
    getEmployees(),
    requestGraphQL<DocumentsDashboardResponse>(documentsDashboardQuery),
  ]);

  return {
    employees: employees.map((employee) => ({
      ...employee,
      email: employee.email ?? null,
      imageUrl: employee.imageUrl ?? null,
      department: employee.department ?? null,
      branch: employee.branch ?? null,
    })),
>>>>>>> Stashed changes
    jobs: dashboard.jobs,
    generatedDocuments: dashboard.generatedDocuments,
    reviewRequests: dashboard.reviewRequests,
    auditLogs: dashboard.auditLogs,
  };
}

export async function retryDocumentJob(input: {
  employeeId: string;
  actionName: string;
}) {
  return requestJson<{
    jobId?: string;
    status: string;
    documentsQueued: number;
  }>('/api/v1/trigger', {
    method: 'POST',
    body: JSON.stringify({
      employeeId: input.employeeId,
      action: input.actionName,
    }),
  });
}

export async function cancelDocumentJob(jobId: string) {
  return requestJson<{ status: string; jobId: string }>(
    `/api/v1/jobs/${jobId}/cancel`,
    {
      method: 'POST',
    },
  );
}
