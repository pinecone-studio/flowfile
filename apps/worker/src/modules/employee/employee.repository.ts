import { eq } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { employees } from '../../db/schema';
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from './employee.types';

export class EmployeeRepository {
  async getById(env: { DB: D1Database }, id: string) {
    const db = getDb(env);
    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async list(env: { DB: D1Database }) {
    const db = getDb(env);
    return db.select().from(employees);
  }

  async create(
    env: { DB: D1Database },
    data: CreateEmployeeInput & {
      id: string;
      createdAt: string;
      updatedAt: string;
    },
  ) {
    const db = getDb(env);
    await db.insert(employees).values(data);
    return this.getById(env, data.id);
  }

  async update(
    env: { DB: D1Database },
    id: string,
    data: Partial<UpdateEmployeeInput> & { updatedAt: string },
  ) {
    const db = getDb(env);
    await db.update(employees).set(data).where(eq(employees.id, id));
    return this.getById(env, id);
  }
}
