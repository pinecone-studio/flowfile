import type {
  DocumentPipelineRow,
  DocumentPipelineStatus,
} from './documentPipeline.types';

export const documentPipelineRows: DocumentPipelineRow[] = [
  {
    id: 'doc-1',
    documentName: 'Employment Contract',
    employee: ['Bat-Erdene Dorj', '(EMP-0042)'],
    action: 'Promotion',
    generatedDate: ['Jan 10, 2026', '09:22'],
    lifecycle: 'Offboarding',
    signedBy: ['HR Lead,', 'Dept Chief'],
    pending: ['Dept Chief,', 'Branch Manager,', 'CEO'],
    status: 'Processing',
  },
  {
    id: 'doc-2',
    documentName: 'Employment Contract',
    employee: ['Bat-Erdene Dorj', '(EMP-0042)'],
    action: 'Promotion',
    generatedDate: ['Jan 10, 2026', '09:22'],
    lifecycle: 'Offboarding',
    signedBy: ['4/4'],
    pending: ['Dept Chief,', 'Branch Manager,', 'CEO'],
    status: 'Pending',
  },
];

export const documentStatusStyles: Record<DocumentPipelineStatus, string> = {
  Pending: 'bg-[#e8f4dd] text-[#6f8f4e]',
  Processing: 'bg-[#d7eff7] text-[#2b9ab8]',
};
