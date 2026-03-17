import { createSchema } from 'graphql-yoga';
import { resolvers } from './resolvers';

export const typeDefs = /* GraphQL */ `
type ActionRegistry {
  actionName: String!
  phase: String!
  triggerFieldsJson: String!
  triggerCondition: String
  documentsJson: String!
  recipientsJson: String!
  isActive: Boolean!
  createdAt: String!
  updatedAt: String!
}

type Recipient {
  id: String!
  roleKey: String!
  recipientName: String
  recipientEmail: String!
  department: String
  branch: String
  isActive: Boolean!
  createdAt: String!
  updatedAt: String!
}

type Job {
  id: String!
  employeeId: String!
  actionName: String!
  triggerSource: String!
  inputPayloadJson: String
  requestedByEmail: String
  dryRun: Boolean!
  status: String!
  documentsExpected: Int!
  documentsGenerated: Int!
  errorMessage: String
  startedAt: String
  completedAt: String
  createdAt: String!
  updatedAt: String!
}

type GeneratedDocument {
  id: String!
  jobId: String!
  employeeId: String!
  actionName: String!
  documentType: String!
  templateName: String!
  fileName: String!
  storagePath: String!
  fileUrl: String
  generationOrder: Int!
  status: String!
  createdAt: String!
  signatureImageUrl: String
  signMethod: String
  signedBy: String
  signedAt: String
  finalizedAt: String
}

type Template {
  name: String!
  htmlContent: String!
  createdAt: String!
  updatedAt: String!
}

type ReviewRequest {
  id: String!
  jobId: String!
  documentId: String!
  reviewerEmail: String!
  reviewerName: String
  signerRole: String!
  signOrder: Int!
  reviewToken: String!
  status: String!
  openedAt: String
  approvedAt: String
  rejectedAt: String
  signatureImageUrl: String
  signMethod: String
  createdAt: String!
  updatedAt: String!
}

type AuditLog {
  id: String!
  jobId: String
  employeeId: String!
  actionName: String!
  eventType: String!
  eventPayloadJson: String
  changedFieldsJson: String
  documentsJson: String
  recipientsJson: String
  status: String!
  message: String
  createdAt: String!
}

type Employee {
  id: String!
  entraId: String
  firstName: String!
  lastName: String!
  firstNameEng: String
  lastNameEng: String
  email: String
  imageUrl: String
  hireDate: String
  numberOfVacationDays: Int
  terminationDate: String
  status: String!
  github: String
  department: String
  branch: String
  employeeCode: String!
  level: String
  isKpi: Boolean!
  isSalaryCompany: Boolean!
  birthDayAndMonth: String
  birthdayPoster: String
  createdAt: String!
  updatedAt: String!
}

input TriggerActionInput {
  employeeId: String!
  actionName: String!
  triggerSource: String!
  dryRun: Boolean = false
  actionPayloadJson: String
  requestedByEmail: String
}

type Query {
  employees: [Employee!]!
  employee(id: String!): Employee

  actions: [ActionRegistry!]!
  action(actionName: String!): ActionRegistry

  recipients: [Recipient!]!
  recipient(id: String!): Recipient

  jobs: [Job!]!
  job(id: String!): Job

  generatedDocuments(jobId: String, employeeId: String): [GeneratedDocument!]!
  auditLogs(employeeId: String, actionName: String, jobId: String): [AuditLog!]!

  templates: [Template!]!
  template(name: String!): Template

  reviewRequests(jobId: String, documentId: String): [ReviewRequest!]!
  reviewRequest(token: String!): ReviewRequest
}

type Mutation {
  triggerAction(input: TriggerActionInput!): Job!
  approveReviewRequest(
    token: String!
    reviewerName: String
    signatureImageUrl: String
    signMethod: String
  ): ReviewRequest!
  rejectReviewRequest(token: String!, reviewerName: String): ReviewRequest!
}
`;

export const graphqlSchema = createSchema({
  typeDefs,
  resolvers,
});
