import { getAllActions, getAction, getAllRecipients, getRecipient } from '../modules/action/action.service';
import { getAuditLogs } from '../modules/audit/audit.service';
import { getGeneratedDocuments } from '../modules/document/document.service';
import { getEmployeeById, listEmployees } from '../modules/employee/employee.service';
import { getAllJobs, getJob, triggerAction } from '../modules/job/job.service';
import {
  approveReviewRequest,
  getReviewRequestByToken,
  getReviewRequests,
  rejectReviewRequest,
} from '../modules/review/review.service';
import { getTemplateByName, getTemplates } from '../modules/templates/templates.service';
import type { GraphQLContext } from './context';

const parseActionPayloadJson = (value?: string | null) => {
  if (!value?.trim()) {
    return undefined;
  }

  return JSON.parse(value) as Record<string, unknown>;
};

const queryResolvers = {
  employees: async (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return listEmployees(context.env);
  },

  employee: async (
    _parent: unknown,
    args: { id: string },
    context: GraphQLContext,
  ) => {
    return getEmployeeById(context.env, args.id);
  },

  actions: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    return getAllActions(context.env);
  },

  action: async (
    _parent: unknown,
    args: { actionName: string },
    context: GraphQLContext,
  ) => {
    return getAction(context.env, args.actionName);
  },

  recipients: async (
    _parent: unknown,
    _args: unknown,
    context: GraphQLContext,
  ) => {
    return getAllRecipients(context.env);
  },

  recipient: async (
    _parent: unknown,
    args: { id: string },
    context: GraphQLContext,
  ) => {
    return getRecipient(context.env, args.id);
  },

  jobs: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    return getAllJobs(context.env);
  },

  job: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
    return getJob(context.env, args.id);
  },

  generatedDocuments: async (
    _parent: unknown,
    args: { jobId?: string; employeeId?: string },
    context: GraphQLContext,
  ) => {
    return getGeneratedDocuments(context.env, args);
  },

  auditLogs: async (
    _parent: unknown,
    args: { employeeId?: string; actionName?: string; jobId?: string },
    context: GraphQLContext,
  ) => {
    return getAuditLogs(context.env, args);
  },

  templates: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
    return getTemplates(context.env);
  },

  template: async (
    _parent: unknown,
    args: { name: string },
    context: GraphQLContext,
  ) => {
    return getTemplateByName(context.env, args.name);
  },

  reviewRequests: async (
    _parent: unknown,
    args: { jobId?: string; documentId?: string },
    context: GraphQLContext,
  ) => {
    return getReviewRequests(context.env, args);
  },

  reviewRequest: async (
    _parent: unknown,
    args: { token: string },
    context: GraphQLContext,
  ) => {
    return getReviewRequestByToken(context.env, args.token);
  },

};

const mutationResolvers = {
  triggerAction: async (
    _parent: unknown,
    args: {
      input: {
        employeeId: string;
        actionName: string;
        triggerSource: string;
        dryRun?: boolean;
        actionPayloadJson?: string | null;
        requestedByEmail?: string | null;
      };
    },
    context: GraphQLContext,
  ) => {
    return triggerAction(context.env, {
      employeeId: args.input.employeeId,
      actionName: args.input.actionName,
      triggerSource: args.input.triggerSource,
      dryRun: args.input.dryRun,
      actionPayload: parseActionPayloadJson(args.input.actionPayloadJson),
      requestedByEmail: args.input.requestedByEmail ?? undefined,
    });
  },

  approveReviewRequest: async (
    _parent: unknown,
    args: {
      token: string;
      reviewerName?: string | null;
      signatureImageUrl?: string | null;
      signMethod?: string | null;
    },
    context: GraphQLContext,
  ) => {
    return approveReviewRequest(context.env, args.token, {
      reviewerName: args.reviewerName ?? null,
      signatureImageUrl: args.signatureImageUrl ?? null,
      signMethod: args.signMethod ?? null,
    });
  },

  rejectReviewRequest: async (
    _parent: unknown,
    args: {
      token: string;
      reviewerName?: string | null;
    },
    context: GraphQLContext,
  ) => {
    return rejectReviewRequest(context.env, args.token, {
      reviewerName: args.reviewerName ?? null,
    });
  },
};

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};
