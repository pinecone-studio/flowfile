import { getAllRecipients } from '../action/action.service';
import {
  generatedNotificationRecipientSpecs,
  genericApproverFields,
  payloadEmailByRole,
} from './workflow.constants';
import {
  buildRecipientFromRecord,
  getPayloadString,
  matchesEmployeeScope,
  pushUniqueEmailRecipient,
  pushUniqueRecipient,
} from './workflow.helpers';
import type {
  EmployeeLike,
  EnvWithDb,
  WorkflowPayload,
  WorkflowRecipient,
  WorkflowRecipientInput,
} from './workflow.types';

const resolveEmployeeEmail = (
  employee: EmployeeLike,
  payload: WorkflowPayload,
) => employee.email ?? getPayloadString(payload, ['employeeEmail']);

const mapOverrideRecipients = (overrideRecipients: WorkflowRecipientInput[]) => {
  return overrideRecipients
    .filter((recipient) => recipient.email.trim())
    .map((recipient, index) => ({
      email: recipient.email.trim(),
      name: recipient.name?.trim() || null,
      role: recipient.role?.trim() || `signer_${index + 1}`,
      signOrder: recipient.signOrder ?? index + 1,
    }));
};

export const resolveWorkflowRecipients = async (
  env: EnvWithDb,
  employee: EmployeeLike,
  roleKeys: string[],
  payload: WorkflowPayload,
  requestedByEmail?: string,
  overrideRecipients?: WorkflowRecipientInput[],
) => {
  if (overrideRecipients && overrideRecipients.length > 0) {
    return mapOverrideRecipients(overrideRecipients);
  }

  const recipients: WorkflowRecipient[] = [];
  const employeeEmail = resolveEmployeeEmail(employee, payload);

  if (employeeEmail) {
    pushUniqueRecipient(recipients, {
      email: employeeEmail,
      name: `${employee.firstName} ${employee.lastName}`.trim(),
      role: 'employee',
      signOrder: 1,
    });
  }

  const availableRecipients = await getAllRecipients(env);

  for (const roleKey of roleKeys) {
    const payloadEmail = getPayloadString(
      payload,
      payloadEmailByRole[roleKey] ?? [],
    );

    if (payloadEmail) {
      pushUniqueRecipient(recipients, {
        email: payloadEmail,
        name: null,
        role: roleKey,
        signOrder: recipients.length + 1,
      });
      continue;
    }

    const match = availableRecipients.find(
      (recipient) =>
        recipient.isActive &&
        recipient.roleKey === roleKey &&
        matchesEmployeeScope(recipient, employee),
    );

    if (match) {
      pushUniqueRecipient(
        recipients,
        buildRecipientFromRecord(match, recipients.length + 1),
      );
    }
  }

  const genericApproverEmail = getPayloadString(payload, genericApproverFields);

  if (genericApproverEmail) {
    pushUniqueRecipient(recipients, {
      email: genericApproverEmail,
      name: null,
      role: recipients.some((recipient) => recipient.role !== 'employee')
        ? 'approver'
        : 'manager',
      signOrder: recipients.length + 1,
    });
  }

  if (requestedByEmail && recipients.length < 2) {
    pushUniqueRecipient(recipients, {
      email: requestedByEmail,
      name: null,
      role: 'hr_requester',
      signOrder: recipients.length + 1,
    });
  }

  return recipients;
};

export const resolveGeneratedDocumentRecipients = async (
  env: EnvWithDb,
  employee: EmployeeLike,
  payload: WorkflowPayload,
  requestedByEmail?: string,
) => {
  const recipients: WorkflowRecipient[] = [];
  const availableRecipients = await getAllRecipients(env);

  for (const spec of generatedNotificationRecipientSpecs) {
    const payloadEmail = getPayloadString(payload, spec.payloadKeys);
    const fallbackRequestedByEmail =
      spec.role === 'hr_management' && requestedByEmail?.trim()
        ? requestedByEmail.trim()
        : null;
    const recipientEmail = payloadEmail ?? fallbackRequestedByEmail;

    if (recipientEmail) {
      pushUniqueEmailRecipient(recipients, {
        email: recipientEmail,
        name: null,
        role: spec.role,
        signOrder: recipients.length + 1,
      });
      continue;
    }

    const match = availableRecipients.find(
      (recipient) =>
        recipient.isActive &&
        (spec.recipientRoleKeys as readonly string[]).includes(
          recipient.roleKey,
        ) &&
        matchesEmployeeScope(recipient, employee),
    );

    if (match) {
      pushUniqueEmailRecipient(recipients, {
        email: match.recipientEmail,
        name: match.recipientName ?? null,
        role: spec.role,
        signOrder: recipients.length + 1,
      });
    }
  }

  const employeeEmail = resolveEmployeeEmail(employee, payload);

  if (employeeEmail) {
    pushUniqueEmailRecipient(recipients, {
      email: employeeEmail,
      name: `${employee.firstName} ${employee.lastName}`.trim(),
      role: 'employee',
      signOrder: recipients.length + 1,
    });
  }

  return recipients;
};
