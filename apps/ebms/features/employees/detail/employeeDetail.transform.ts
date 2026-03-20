import { resolveImageSrc } from '../../../lib/assets/resolveImageSrc';
import type {
  ApiAction,
  ApiAuditLog,
  ApiDocument,
  ApiEmployee,
} from './employeeDetail.api';
import type {
  DetailActionItem,
  DetailDocumentItem,
  EmployeeProfile,
} from './employeeProfile.data';

export type TriggerActionDefinition = {
  actionName: string;
  label: string;
  fields: string[];
  phase: string | null;
  documents: string[];
  recipientRoles: string[];
};

const actionLabelMap: Record<string, string> = {
  add_employee: 'Onboard',
  change_position: 'Change Role',
  salary_increase: 'Promote',
  offboard_employee: 'Terminate',
};

const actionToneMap: Record<string, DetailActionItem['tone']> = {
  add_employee: 'onboarding',
  change_position: 'role-change',
  salary_increase: 'promotion',
  offboard_employee: 'terminate',
};

const actionOrder = ['add_employee', 'change_position', 'salary_increase', 'offboard_employee'];

function safeParseFields(value: string) {
  try {
    return JSON.parse(value || '[]') as string[];
  } catch {
    return [];
  }
}

type RawActionDocumentConfig = {
  id?: string;
  documentType?: string;
  fileName?: string;
  template?: string;
  templateName?: string;
};

function safeParseRecipients(value: string) {
  try {
    const parsed = JSON.parse(value || '[]') as Array<
      string | { roleKey?: string | null }
    >;

    return parsed
      .map((recipient) =>
        typeof recipient === 'string' ? recipient : recipient.roleKey ?? '',
      )
      .filter(Boolean);
  } catch {
    return [];
  }
}

function safeParseDocuments(value: string) {
  try {
    const parsed = JSON.parse(value || '[]') as RawActionDocumentConfig[];

    return parsed
      .map(
        (document, index) =>
          document.documentType ??
          document.id ??
          document.fileName ??
          document.templateName ??
          document.template ??
          `document_${index + 1}`,
      )
      .filter(Boolean);
  } catch {
    return [];
  }
}

function toTitleCase(value: string) {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDate(value: string | null | undefined, fallback = '-') {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTimeParts(value: string) {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
    year: String(date.getFullYear()),
  };
}

function formatYearsWorked(hireDate: string | null) {
  if (!hireDate) {
    return '-';
  }

  const years = Math.max(0, (Date.now() - new Date(hireDate).getTime()) / 31557600000);
  return years < 1 ? '<1 year' : `${Math.floor(years)} year${years >= 2 ? 's' : ''}`;
}

function toDisplayName(employee: ApiEmployee) {
  return `${employee.firstName}.${employee.lastName.charAt(0)}`;
}

export function toTriggerActions(actions: ApiAction[]) {
  return actions
    .filter((action) => action.isActive && actionLabelMap[action.actionName])
    .sort(
      (left, right) =>
        actionOrder.indexOf(left.actionName) - actionOrder.indexOf(right.actionName),
    )
    .map((action) => ({
      actionName: action.actionName,
      label: actionLabelMap[action.actionName],
      fields: safeParseFields(action.triggerFieldsJson),
      phase: action.phase,
      documents: safeParseDocuments(action.documentsJson),
      recipientRoles: safeParseRecipients(action.recipientsJson),
    })) satisfies TriggerActionDefinition[];
}

export function toEmployeeProfile(
  employee: ApiEmployee,
  documents: ApiDocument[],
  auditLogs: ApiAuditLog[],
): EmployeeProfile {
  const timeline = auditLogs
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 3)
    .map((log) => {
      const dateParts = formatDateTimeParts(log.createdAt);
      return {
        id: log.id,
        date: dateParts.date,
        year: dateParts.year,
        label: actionLabelMap[log.actionName] ?? log.actionName,
        state: log.message ?? (log.status === 'success' ? 'Complete!' : 'In Progress'),
        width: log.status === 'error' ? '60%' : log.status === 'success' ? '78%' : '72%',
        tone: actionToneMap[log.actionName] ?? 'onboarding',
      };
    });
  const documentItems: DetailDocumentItem[] = documents
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((document) => ({
      id: document.id,
      title: toTitleCase(document.documentType),
      status:
        document.status === 'failed' || document.status === 'rejected'
          ? 'Failed'
          : document.status === 'completed'
            ? 'Generated'
            : 'Generating...',
      date: formatDateTimeParts(document.createdAt).date,
    }));

  return {
    id: employee.id,
    image: resolveImageSrc(employee.imageUrl, '/image%205.svg'),
    code: employee.employeeCode,
    status: employee.status === 'TERMINATED' ? 'Terminated' : employee.status === 'INACTIVE' ? 'Inactive' : 'Active',
    name: toDisplayName(employee),
    fullName: `${employee.firstName} ${employee.lastName}`.trim(),
    role: employee.level || employee.department || 'Employee',
    email: employee.email || '-',
    personalInfo: [
      { label: 'Full Name', value: `${employee.firstName} ${employee.lastName}`.trim() },
      { label: 'Birthday', value: formatDate(employee.birthDayAndMonth) },
    ],
    workInfo: [
      { label: 'Position', value: employee.level || '-' },
      { label: 'Department', value: employee.department || '-' },
      { label: 'Employee Code', value: employee.employeeCode },
      { label: 'Years Worked', value: formatYearsWorked(employee.hireDate) },
      { label: 'KPI Eligible', value: employee.isKpi ? 'Yes' : 'No' },
      { label: 'Paid by Company', value: employee.isSalaryCompany ? 'Yes' : 'No' },
    ],
    contactInfo: [{ label: 'Email', value: employee.email || '-' }],
    timeline,
    documents: documentItems,
    generateOptions: ['Select a document', ...(documentItems.map((item) => item.title))],
  };
}

export function getDefaultActionValue(employee: ApiEmployee, fieldName: string) {
  return employee[fieldName as keyof ApiEmployee] ?? '';
}
