import { getEmployees } from '../../lib/employee/api';
import { requestGraphQL } from '../../lib/api/client';

export type DashboardEmployee = {
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

export type DashboardJob = {
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

export type DashboardGeneratedDocument = {
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

export type DashboardReviewRequest = {
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

type DashboardQueryResponse = {
  jobs: DashboardJob[];
  generatedDocuments: DashboardGeneratedDocument[];
  reviewRequests: DashboardReviewRequest[];
};

const dashboardQuery = `
  query DashboardPageData {
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
  }
`;

export async function fetchDashboardData() {
  const [employees, dashboard] = await Promise.all([
    getEmployees(),
    requestGraphQL<DashboardQueryResponse>(dashboardQuery),
  ]);

  return {
    employees: employees.map((employee) => ({
      ...employee,
      email: employee.email ?? null,
      imageUrl: employee.imageUrl ?? null,
      department: employee.department ?? null,
      branch: employee.branch ?? null,
    })),
    jobs: dashboard.jobs,
    generatedDocuments: dashboard.generatedDocuments,
    reviewRequests: dashboard.reviewRequests,
  };
}
