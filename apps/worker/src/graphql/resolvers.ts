import {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
} from '../modules/employee/employee.service';
import { getAllActions, getAction } from '../modules/action/action.service';
import { getAllJobs, getJob, triggerAction } from '../modules/job/job.service';
import { getGeneratedDocuments } from '../modules/document/document.service';
import { getAuditLogs } from '../modules/audit/audit.service';

type GraphQLContext = {
  env: {
    DB: D1Database;
    EPAS_WEBHOOK_URL?: string;
  };
};

export const resolvers = {
  Query: {
    employees: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) =>
      listEmployees(ctx.env),

    employee: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => getEmployeeById(ctx.env, args.id),

    actions: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) =>
      getAllActions(ctx.env),

    action: async (
      _parent: unknown,
      args: { actionName: string },
      ctx: GraphQLContext,
    ) => getAction(ctx.env, args.actionName),

    jobs: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) =>
      getAllJobs(ctx.env),

    job: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => getJob(ctx.env, args.id),

    generatedDocuments: async (
      _parent: unknown,
      args: { jobId?: string; employeeId?: string },
      ctx: GraphQLContext,
    ) => getGeneratedDocuments(ctx.env, args),

    auditLogs: async (
      _parent: unknown,
      args: { employeeId?: string; actionName?: string; jobId?: string },
      ctx: GraphQLContext,
    ) => getAuditLogs(ctx.env, args),
  },

  Mutation: {
    createEmployee: async (
      _parent: unknown,
      args: { input: any },
      ctx: GraphQLContext,
    ) => createEmployee(ctx.env, args.input),

    updateEmployee: async (
      _parent: unknown,
      args: { id: string; input: any },
      ctx: GraphQLContext,
    ) => updateEmployee(ctx.env, args.id, args.input),

    triggerAction: async (
      _parent: unknown,
      args: {
        input: {
          employeeId: string;
          actionName: string;
          triggerSource: string;
          dryRun?: boolean;
        };
      },
      ctx: GraphQLContext,
    ) => triggerAction(ctx.env, args.input),
  },
};