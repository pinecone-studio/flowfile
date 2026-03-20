import { Hono } from 'hono';
import {
  getGeneratedDocumentById,
  getGeneratedDocuments,
} from '../../modules/document/document.service';
import { getEmployeeById } from '../../modules/employee/employee.service';
import { getJob } from '../../modules/job/job.service';
import { getReviewRequests } from '../../modules/review/review.service';
import { reviewsToWorkflowRecipients } from '../../modules/review/review.utils';
import { requireTemplateByName } from '../../modules/templates/templates.service';
import {
  buildWorkflowDocumentHtml,
  parseWorkflowPayload,
} from '../../modules/workflow/workflow.service';
import type { AppEnv } from '../types';

const documentsRoutes = new Hono<AppEnv>();

documentsRoutes.get('/documents/:employeeId', async (c) => {
  const employeeId = c.req.param('employeeId');
  const jobId = c.req.query('jobId')?.trim();
  const documents = await getGeneratedDocuments(c.env, {
    employeeId,
    jobId: jobId || undefined,
  });

  return c.json(documents);
});

documentsRoutes.get('/document-previews/:documentId', async (c) => {
  const documentId = c.req.param('documentId');
  const document = await getGeneratedDocumentById(c.env, documentId);

  if (!document) {
    return c.json({ message: 'Document not found' }, 404);
  }

  const [job, employee, reviews, template] = await Promise.all([
    getJob(c.env, document.jobId),
    getEmployeeById(c.env, document.employeeId),
    getReviewRequests(c.env, { documentId }),
    requireTemplateByName(c.env, document.templateName),
  ]);

  if (!job) {
    return c.json({ message: 'Job not found for document' }, 404);
  }

  if (!employee) {
    return c.json({ message: 'Employee not found for document' }, 404);
  }

  const approvalSummary = reviews.map((review) => ({
    reviewerEmail: review.reviewerEmail,
    reviewerName: review.reviewerName,
    approvedAt: review.approvedAt,
    signMethod: review.signMethod,
  }));
  const html = buildWorkflowDocumentHtml({
    documentType: document.documentType,
    actionName: job.actionName,
    employee,
    payload: parseWorkflowPayload(
      job.inputPayloadJson ? JSON.parse(job.inputPayloadJson) : {},
    ),
    recipients: reviewsToWorkflowRecipients(reviews),
    status: document.status,
    templateName: template.name,
    templateHtml: template.htmlContent,
    approvalSummary,
    signatureImageUrl: document.signatureImageUrl,
    renderSignatureImage: true,
  });

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
});

documentsRoutes.get('/document-files/:documentId', async (c) => {
  const documentId = c.req.param('documentId');
  const document = await getGeneratedDocumentById(c.env, documentId);

  if (!document) {
    return c.json({ message: 'Document not found' }, 404);
  }

  const object = await c.env.DOCS_BUCKET.get(document.storagePath);

  if (!object) {
    return c.json({ message: 'Stored document not found' }, 404);
  }

  return new Response(object.body, {
    headers: {
      'Content-Type':
        object.httpMetadata?.contentType ?? 'application/pdf',
      'Content-Disposition': `inline; filename="${document.fileName}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
});

export default documentsRoutes;
