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
    department?: string | null;
    branch?: string | null;
    level?: string | null;
    numberOfVacationDays?: number | null;
    isSalaryCompany?: boolean;
  };
  previousEmployee?: {
    status?: string;
    terminationDate?: string | null;
    department?: string | null;
    branch?: string | null;
    level?: string | null;
    numberOfVacationDays?: number | null;
    isSalaryCompany?: boolean;
  };
};

const webhooksRoutes = new Hono<AppEnv>();

const normalizeActionName = (value?: string) => value?.trim() ?? '';

const unique = <T,>(values: T[]) => Array.from(new Set(values));

const levelOrder: Record<string, number> = {
  intern: 0,
  junior: 1,
  mid: 2,
  senior: 3,
  lead: 4,
  manager: 5,
  director: 6,
  head: 7,
  vp: 8,
  cxo: 9,
  ceo: 10,
};

function normalizeLevelValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function getLevelRank(value?: string | null) {
  const normalized = normalizeLevelValue(value);

  if (!normalized) {
    return null;
  }

  if (normalized in levelOrder) {
    return levelOrder[normalized];
  }

  const numericMatch = normalized.match(/\d+/);

  if (numericMatch) {
    return Number(numericMatch[0]);
  }

  return null;
}

function hasValueChanged<T>(previousValue: T | undefined, nextValue: T | undefined) {
  return previousValue !== nextValue;
}

function inferLevelAction(body: EmployeeEventBody) {
  const previousLevel = body.previousEmployee?.level;
  const nextLevel = body.employee?.level;
  const previousRank = getLevelRank(previousLevel);
  const nextRank = getLevelRank(nextLevel);

  if (previousRank != null && nextRank != null) {
    return nextRank > previousRank ? 'promote_employee' : 'change_position';
  }

  if (
    previousLevel != null &&
    nextLevel != null &&
    normalizeLevelValue(previousLevel) !== normalizeLevelValue(nextLevel)
  ) {
    return 'change_position';
  }

  return null;
}

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

  if (changedFields.includes('department')) {
    actionNames.add('change_position');
  }

  if (changedFields.includes('branch')) {
    actionNames.add('change_position');
  }

  if (changedFields.includes('level')) {
    const levelAction = inferLevelAction(body);

    if (levelAction) {
      actionNames.add(levelAction);
    }
  }

  if (
    changedFields.includes('numberOfVacationDays') &&
    hasValueChanged(
      body.previousEmployee?.numberOfVacationDays,
      body.employee?.numberOfVacationDays,
    )
  ) {
    actionNames.add('promote_employee');
  }

  if (
    changedFields.includes('isSalaryCompany') &&
    hasValueChanged(
      body.previousEmployee?.isSalaryCompany,
      body.employee?.isSalaryCompany,
    )
  ) {
    actionNames.add('promote_employee');
  }

  const employeeStatus = body.employee?.status?.toUpperCase();
  const previousTerminationDate = body.previousEmployee?.terminationDate ?? null;
  const nextTerminationDate = body.employee?.terminationDate ?? null;
  if (
    (changedFields.includes('terminationDate') &&
      previousTerminationDate == null &&
      nextTerminationDate != null) ||
    (changedFields.includes('status') &&
      (employeeStatus === 'TERMINATED' || employeeStatus === 'INACTIVE'))
  ) {
    actionNames.add('offboard_employee');
  }

  if (actionNames.size > 0) {
    return [...actionNames];
  }

  const mappedFields = new Set([
    'department',
    'branch',
    'level',
    'numberOfVacationDays',
    'isSalaryCompany',
    'terminationDate',
    'status',
  ]);
  const hasOnlyMappedFields =
    changedFields.length > 0 && changedFields.every((field) => mappedFields.has(field));

  if (hasOnlyMappedFields) {
    return [];
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
