import {
  listEmployees,
  getEmployeeById,
} from '../modules/employee/employee.service';

import {
  getAllActions,
  getAction,
  getAllRecipients,
  getRecipient,
} from '../modules/action/action.service';

import { getAllJobs, getJob, triggerAction } from '../modules/job/job.service';

import { getGeneratedDocuments } from '../modules/document/document.service';
import { getAuditLogs } from '../modules/audit/audit.service';
import {
  getTemplates,
  getTemplateByName,
} from '../modules/templates/templates.service';
import {
  getReviewRequestByToken,
  getReviewRequests,
} from '../modules/review/review.service';

type GraphQLContext = {
  env: {
    DB: D1Database;
    EPAS_WEBHOOK_URL?: string;
  };
};

export const root = {
  employees: async (_args: unknown, context: GraphQLContext) => {
    return listEmployees(context.env);
  },

  employee: async (args: { id: string }, context: GraphQLContext) => {
    return getEmployeeById(context.env, args.id);
  },

  actions: async (_args: unknown, context: GraphQLContext) => {
    return getAllActions(context.env);
  },

  action: async (args: { actionName: string }, context: GraphQLContext) => {
    return getAction(context.env, args.actionName);
  },

  recipients: async (_args: unknown, context: GraphQLContext) => {
    return getAllRecipients(context.env);
  },

  recipient: async (args: { id: string }, context: GraphQLContext) => {
    return getRecipient(context.env, args.id);
  },

  jobs: async (_args: unknown, context: GraphQLContext) => {
    return getAllJobs(context.env);
  },

  job: async (args: { id: string }, context: GraphQLContext) => {
    return getJob(context.env, args.id);
  },

  generatedDocuments: async (
    args: { jobId?: string; employeeId?: string },
    context: GraphQLContext,
  ) => {
    return getGeneratedDocuments(context.env, args);
  },

  auditLogs: async (
    args: { employeeId?: string; actionName?: string; jobId?: string },
    context: GraphQLContext,
  ) => {
    return getAuditLogs(context.env, args);
  },

  templates: async (_args: unknown, context: GraphQLContext) => {
    return getTemplates(context.env);
  },

  template: async (args: { name: string }, context: GraphQLContext) => {
    return getTemplateByName(context.env, args.name);
  },

  reviewRequests: async (args: { jobId?: string }, context: GraphQLContext) => {
    return getReviewRequests(context.env, args);
  },

  reviewRequest: async (args: { token: string }, context: GraphQLContext) => {
    return getReviewRequestByToken(context.env, args.token);
  },

  triggerAction: async (
    args: {
      input: {
        employeeId: string;
        actionName: string;
        triggerSource: string;
        dryRun?: boolean;
      };
    },
    context: GraphQLContext,
  ) => {
    return triggerAction(context.env, args.input);
  },
};
