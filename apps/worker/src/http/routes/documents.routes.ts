import { Hono } from 'hono';
import {
  getGeneratedDocumentById,
  getGeneratedDocuments,
} from '../../modules/document/document.service';
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
    },
  });
});

export default documentsRoutes;
