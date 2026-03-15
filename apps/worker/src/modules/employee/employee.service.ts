import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from './employee.types';
import { EmployeeRepository } from './employee.repository';
import { detectChangedFields } from './employee.utils';

type EnvWithBindings = {
  DB: D1Database;
  EPAS_WEBHOOK_URL?: string;
};

export class EmployeeService {
  constructor(private readonly repository = new EmployeeRepository()) {}

  async listEmployees(env: EnvWithBindings) {
    return this.repository.list(env);
  }

  async getEmployeeById(env: EnvWithBindings, id: string) {
    return this.repository.getById(env, id);
  }

  async createEmployee(env: EnvWithBindings, input: CreateEmployeeInput) {
    const now = new Date().toISOString();

    const employee = await this.repository.create(env, {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    });

    if (employee) {
      await this.sendEvent(env.EPAS_WEBHOOK_URL, {
        event: 'employee.created',
        employeeId: employee.id,
        changedFields: ['status', 'hireDate'],
        timestamp: now,
        isNewRecord: true,
      });
    }

    return employee;
  }

  async updateEmployee(
    env: EnvWithBindings,
    id: string,
    input: UpdateEmployeeInput,
  ) {
    const existing = await this.repository.getById(env, id);

    if (!existing) {
      return null;
    }

    const changedFields = detectChangedFields(
      existing as Record<string, unknown>,
      input as Record<string, unknown>,
    );

    if (changedFields.length === 0) {
      return existing;
    }

    const updated = await this.repository.update(env, id, {
      ...input,
      updatedAt: new Date().toISOString(),
    });

    await this.sendEvent(env.EPAS_WEBHOOK_URL, {
      event: 'employee.updated',
      employeeId: id,
      changedFields,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  private async sendEvent(webhookUrl: string | undefined, payload: unknown) {
    console.log('WEBHOOK URL:', webhookUrl);
    console.log('WEBHOOK PAYLOAD:', JSON.stringify(payload, null, 2));

    if (!webhookUrl) return;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('WEBHOOK STATUS:', response.status);

    const text = await response.text();
    console.log('WEBHOOK RESPONSE BODY:', text);
  }
}

const employeeService = new EmployeeService();

export const listEmployees = (env: EnvWithBindings) =>
  employeeService.listEmployees(env);

export const getEmployeeById = (env: EnvWithBindings, id: string) =>
  employeeService.getEmployeeById(env, id);

export const createEmployee = (
  env: EnvWithBindings,
  input: CreateEmployeeInput,
) => employeeService.createEmployee(env, input);

export const updateEmployee = (
  env: EnvWithBindings,
  id: string,
  input: UpdateEmployeeInput,
) => employeeService.updateEmployee(env, id, input);
