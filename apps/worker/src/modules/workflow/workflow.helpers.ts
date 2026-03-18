import type {
  RecipientRecord,
  WorkflowPayload,
  WorkflowRecipient,
} from './workflow.types';

export function getPayloadString(
  payload: WorkflowPayload,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export function pushUniqueRecipient(
  recipients: WorkflowRecipient[],
  recipient: WorkflowRecipient,
) {
  const alreadyExists = recipients.some(
    (current) =>
      current.email.toLowerCase() === recipient.email.toLowerCase() &&
      current.role === recipient.role,
  );

  if (!alreadyExists) {
    recipients.push(recipient);
  }
}

export function pushUniqueEmailRecipient(
  recipients: WorkflowRecipient[],
  recipient: WorkflowRecipient,
) {
  const alreadyExists = recipients.some(
    (current) => current.email.toLowerCase() === recipient.email.toLowerCase(),
  );

  if (!alreadyExists) {
    recipients.push(recipient);
  }
}

export function matchesEmployeeScope(
  recipient: RecipientRecord,
  employee: { department: string | null; branch: string | null },
) {
  const departmentMatches =
    !recipient.department || recipient.department === employee.department;
  const branchMatches =
    !recipient.branch || recipient.branch === employee.branch;

  return departmentMatches && branchMatches;
}

export function buildRecipientFromRecord(
  record: RecipientRecord,
  signOrder: number,
): WorkflowRecipient {
  return {
    email: record.recipientEmail,
    name: record.recipientName ?? null,
    role: record.roleKey,
    signOrder,
  };
}

export function parseWorkflowPayload(value: unknown): WorkflowPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as WorkflowPayload;
}

export function titleCaseRole(role: string) {
  return role
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
