import { buildApiUrl } from '../../lib/api/client';
import type {
  DocumentMenuActionKey,
  DocumentsPageGroup,
  DocumentsPageItem,
} from './documents.transform';

type DocumentsActionsParams = {
  push: (href: string) => void;
  retryJob: (employeeId: string, actionName: string) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  setPageError: (message: string | null) => void;
  setOpenMenuId: (value: string | null) => void;
  setBusyKey: (value: string | null) => void;
  setErrorModal: (value: { title: string; message: string } | null) => void;
};

export function useDocumentsActions(params: DocumentsActionsParams) {
  return async function handleDocumentAction(
    group: DocumentsPageGroup,
    item: DocumentsPageItem,
    action: DocumentMenuActionKey,
  ) {
    try {
      params.setPageError(null);
      params.setOpenMenuId(null);

      if (action === 'download') {
        window.open(buildApiUrl(item.downloadUrl), '_blank', 'noopener,noreferrer');
      } else if (action === 'sign' && item.signToken) {
        params.push(`/sign?token=${encodeURIComponent(item.signToken)}`);
      } else if (action === 'audit') {
        params.push(
          `/audit-log?jobId=${encodeURIComponent(group.id)}&employeeId=${encodeURIComponent(group.employeeId)}`,
        );
      } else if (action === 'error' && item.errorMessage) {
        params.setErrorModal({ title: `${item.title} Error`, message: item.errorMessage });
      } else {
        params.setBusyKey(`${group.id}:${action}`);
        if (action === 'retry') {
          await params.retryJob(group.employeeId, group.actionName);
        }
        if (action === 'cancel') {
          await params.cancelJob(group.id);
        }
      }
    } catch (actionError) {
      params.setPageError(
        actionError instanceof Error ? actionError.message : 'Action failed.',
      );
    } finally {
      params.setBusyKey(null);
    }
  };
}
