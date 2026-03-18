export type DocumentPipelineStatus = 'Pending' | 'Processing';

export type DocumentPipelineRow = {
  id: string;
  documentName: string;
  employee: string[];
  action: string;
  generatedDate: string[];
  lifecycle: string;
  signedBy: string[];
  pending: string[];
  status: DocumentPipelineStatus;
};
