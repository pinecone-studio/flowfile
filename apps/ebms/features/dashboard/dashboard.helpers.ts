import type {
  DashboardEmployee,
  DashboardGeneratedDocument,
  DashboardJob,
  DashboardReviewRequest,
} from './dashboard.api';
import { buildProgressSteps } from '../documents/documents.progress';
import {
  buildPendingLabel,
  mapDocumentStatusLabel,
  mapJobState,
} from '../documents/documents.status';

function formatDate(value: string | null | undefined) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function isSameDay(value: string | null | undefined, date = new Date()) {
  if (!value) return false;

  const current = new Date(value);

  return (
    current.getFullYear() === date.getFullYear() &&
    current.getMonth() === date.getMonth() &&
    current.getDate() === date.getDate()
  );
}

function prettifyActionName(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEmployeeName(employee?: DashboardEmployee) {
  if (!employee) return 'Unknown Employee';
  return (
    `${employee.firstName} ${employee.lastName}`.trim() ||
    employee.email ||
    'Unknown Employee'
  );
}

function getEmployeeAvatar(employee?: DashboardEmployee) {
  return employee?.imageUrl || '/pro5.png';
}

export function buildDashboardModel(input: {
  employees: DashboardEmployee[];
  jobs: DashboardJob[];
  generatedDocuments: DashboardGeneratedDocument[];
  reviewRequests: DashboardReviewRequest[];
}) {
  const employeeMap = new Map(
    input.employees.map((employee) => [employee.id, employee]),
  );
  const documentsByJobId = new Map<string, DashboardGeneratedDocument[]>();
  const reviewsByJobId = new Map<string, DashboardReviewRequest[]>();

  for (const document of input.generatedDocuments) {
    const current = documentsByJobId.get(document.jobId) ?? [];
    current.push(document);
    documentsByJobId.set(document.jobId, current);
  }

  for (const review of input.reviewRequests) {
    const current = reviewsByJobId.get(review.jobId) ?? [];
    current.push(review);
    reviewsByJobId.set(review.jobId, current);
  }

  const jobsSorted = [...input.jobs].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );

  const latestActions = jobsSorted.slice(0, 3).map((job) => {
    const employee = employeeMap.get(job.employeeId);
    const progressMax = Math.max(job.documentsExpected || 0, 1);
    const progress = Math.max(
      8,
      Math.min(100, Math.round((job.documentsGenerated / progressMax) * 100)),
    );

    return {
      id: job.id,
      avatar: getEmployeeAvatar(employee),
      employee: getEmployeeName(employee),
      code: employee?.employeeCode ?? '-',
      action: prettifyActionName(job.actionName),
      date: formatDate(job.updatedAt || job.createdAt),
      state: mapJobState(job),
      progress,
    };
  });

  const latestDocuments = [...input.generatedDocuments]
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((document) => {
      const employee = employeeMap.get(document.employeeId);

      return {
        id: document.id,
        name:
          document.templateName || document.documentType || document.fileName,
        employee: getEmployeeName(employee),
        status: mapDocumentStatusLabel(document.status),
        timestamp: formatDate(document.createdAt),
      };
    });

  const waitingDocuments = [...input.generatedDocuments]
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    )
    .map((document) => {
      const employee = employeeMap.get(document.employeeId);
      const relatedReviews = input.reviewRequests.filter(
        (review) => review.documentId === document.id,
      );
      const pending = buildPendingLabel(document, relatedReviews);

      return {
        id: document.id,
        employee: getEmployeeName(employee),
        employeeCode: employee?.employeeCode ?? '-',
        name:
          document.templateName || document.documentType || document.fileName,
        timestamp: formatDate(document.createdAt),
        pendingLabel: pending.pendingLabel,
        signToken: pending.signToken,
      };
    })
    .filter(
      (document) =>
        document.pendingLabel !== 'All Signed' &&
        document.pendingLabel !== 'Generation Error' &&
        document.pendingLabel !== 'Canceled',
    )
    .slice(0, 2);

  const focusJob = jobsSorted[0];
  const focusDocuments = focusJob
    ? (documentsByJobId.get(focusJob.id) ?? [])
    : [];
  const focusReviews = focusJob ? (reviewsByJobId.get(focusJob.id) ?? []) : [];
  const progressSteps = focusJob
    ? buildProgressSteps(focusJob, focusDocuments, focusReviews)
    : [];

  const todayActionCount = input.jobs.filter((job) =>
    isSameDay(job.createdAt),
  ).length;
  const todayDocumentCount = input.generatedDocuments.filter((doc) =>
    isSameDay(doc.createdAt),
  ).length;
  const todayApproveCount = input.reviewRequests.filter(
    (review) => review.status === 'approved' && isSameDay(review.approvedAt),
  ).length;

  return {
    metrics: [
      { label: 'New Actions Today', value: todayActionCount },
      { label: 'New Documents Today', value: todayDocumentCount },
      { label: 'New Approves Today', value: todayApproveCount },
    ],
    latestActions,
    latestDocuments,
    waitingDocuments,
    progressSteps,
  };
}
