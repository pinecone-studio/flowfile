import { Hono } from 'hono';
import { getGeneratedDocuments } from '../../modules/document/document.service';
import type { AppEnv } from '../types';

const documentsRoutes = new Hono<AppEnv>();

documentsRoutes.get('/documents/:employeeId', async (c) => {
  const employeeId = c.req.param('employeeId');
  const documents = await getGeneratedDocuments(c.env, { employeeId });

  return c.json(documents);
});

export default documentsRoutes;
