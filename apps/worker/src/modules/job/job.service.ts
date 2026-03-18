import { getGeneratedDocuments } from '../document/document.service';
import { getReviewRequests } from '../review/review.service';
import {
  getJobById as repoGetJobById,
  listJobs as repoListJobs,
} from './job.repository';
import type { EnvWithBindings } from './job.types';

export { triggerAction } from './job.trigger';
export type { TriggerActionInput } from './job.types';

export const getAllJobs = async (env: EnvWithBindings) => {
  return repoListJobs(env);
};

export const getJob = async (env: EnvWithBindings, id: string) => {
  return repoGetJobById(env, id);
};

export const getWorkflowSnapshot = async (
  env: EnvWithBindings,
  jobId: string,
) => {
  const [job, documents, reviewRequests] = await Promise.all([
    repoGetJobById(env, jobId),
    getGeneratedDocuments(env, { jobId }),
    getReviewRequests(env, { jobId }),
  ]);

  return {
    job,
    documents,
    reviewRequests,
  };
};
