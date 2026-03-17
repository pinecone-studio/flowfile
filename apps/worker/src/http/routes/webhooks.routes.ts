import { Hono, type Context } from 'hono';
import { getAllActions, parseTriggerFields } from '../../modules/action/action.service';
import { triggerAction } from '../../modules/job/job.service';
import type { AppEnv } from '../types';

type EmployeeEventBody = {
  event?: string;
  actionName?: string;
  employeeId?: string;
  changedFields?: string[];
  isNewRecord?: boolean;
  requestedByEmail?: string;
  payload?: Record<string, unknown>;
  employee?: {
    status?: string;
    terminationDate?: string | null;
  };
};

const webhooksRoutes = new Hono<AppEnv>();

const normalizeActionName = (value?: string) => value?.trim() ?? '';

const unique = <T,>(values: T[]) => Array.from(new Set(values));

const inferActionNamesFromEvent = async (
  env: AppEnv['Bindings'],
  body: EmployeeEventBody,
) => {
  const explicitAction = normalizeActionName(body.actionName);

  if (explicitAction) {
    return [explicitAction];
  }

  const changedFields = Array.isArray(body.changedFields) ? body.changedFields : [];
  const actionNames = new Set<string>();

  if (body.event === 'employee.created' || body.isNewRecord) {
    actionNames.add('add_employee');
  }

  if (
    changedFields.some((field) =>
      ['department', 'branch', 'level'].includes(field),
    )
  ) {
    actionNames.add('change_position');
  }

  if (
    changedFields.some((field) =>
      ['salary', 'salaryAmount', 'salaryGrade', 'isSalaryCompany', 'numberOfVacationDays'].includes(
        field,
      ),
    )
  ) {
    actionNames.add('salary_increase');
  }

  const employeeStatus = body.employee?.status?.toUpperCase();
  if (
    changedFields.includes('terminationDate') ||
    changedFields.includes('status') ||
    employeeStatus === 'TERMINATED'
  ) {
    actionNames.add('offboard_employee');
  }

  if (actionNames.size > 0) {
    return [...actionNames];
  }

  const allActions = await getAllActions(env);

  return unique(
    allActions
      .filter((action) =>
        parseTriggerFields(action).some((field) => changedFields.includes(field)),
      )
      .map((action) => action.actionName),
  );
};

export const receiveEmployeeEvent = async (c: Context<AppEnv>) => {
  const body = await c.req.json<EmployeeEventBody>();

  if (!body.employeeId?.trim()) {
    return c.json({ message: 'employeeId is required' }, 400);
  }

  const actionNames = await inferActionNamesFromEvent(c.env, body);

  if (actionNames.length === 0) {
    return c.json({
      received: true,
      employeeId: body.employeeId,
      triggered: [],
      message: 'No matching actions for event',
    });
  }

  const results = [];
  const errors = [];

  for (const actionName of actionNames) {
    try {
      const job = await triggerAction(c.env, {
        employeeId: body.employeeId.trim(),
        actionName,
        triggerSource: 'employee_event',
        actionPayload: body.payload,
        requestedByEmail: body.requestedByEmail,
      });

      results.push({
        actionName,
        jobId: job?.id ?? null,
        status: job?.status ?? 'accepted',
      });
    } catch (error) {
      errors.push({
        actionName,
        message: error instanceof Error ? error.message : 'Unknown trigger error',
      });
    }
  }

  return c.json({
    received: true,
    employeeId: body.employeeId,
    triggered: results,
    errors,
  });
};

webhooksRoutes.post('/employee.changed', receiveEmployeeEvent);

export default webhooksRoutes;
