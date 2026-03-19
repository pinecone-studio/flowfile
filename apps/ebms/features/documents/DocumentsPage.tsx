'use client';

import { useMemo, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '../../lib/documents/hooks/useDocuments';
import {
  GlassPanel,
  PageDivider,
  PageShell,
  PageTitle,
  PanelHeader,
  SearchBar,
} from '../flowfile/flowfile.ui';
import { DocumentsAlert } from './components/DocumentsAlert';
import { DocumentsErrorModal } from './components/DocumentsErrorModal';
import { DocumentsList } from './components/DocumentsList';
import { DocumentsProgressPanel } from './components/DocumentsProgressPanel';
import { DocumentsSummary } from './components/DocumentsSummary';
import { DocumentsTabs } from './components/DocumentsTabs';
import { useDocumentsActions } from './useDocumentsActions';

type ErrorModalState = {
  title: string;
  message: string;
} | null;

export default function DocumentsPage() {
  const router = useRouter();
  const {
    categories,
    groups,
    ongoingCount,
    completedCount,
    loading,
    refreshing,
    error,
    search,
    categoryKey,
    setSearch,
    setCategoryKey,
    retryJob,
    cancelJob,
  } = useDocuments();
  const [openGroupId, setOpenGroupId] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<ErrorModalState>(null);

  const openGroup = useMemo(
    () => groups.find((group) => group.id === openGroupId) ?? null,
    [groups, openGroupId],
  );

  const handleDocumentAction = useDocumentsActions({
    push: router.push,
    retryJob,
    cancelJob,
    setPageError,
    setOpenMenuId,
    setBusyKey,
    setErrorModal,
  });

  return (
    <PageShell>
      <PageTitle
        title="Documents"
        subtitle={
          <DocumentsSummary
            ongoingCount={ongoingCount}
            completedCount={completedCount}
            refreshing={refreshing}
          />
        }
      />
      <PageDivider />
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <DocumentsTabs
          categories={categories}
          categoryKey={categoryKey}
          onChange={setCategoryKey}
        />
        <SearchBar
          placeholder="Search employee or action..."
          className="max-w-[392px]"
          value={search}
          onChange={setSearch}
        />
      </div>
      {error || pageError ? (
        <DocumentsAlert message={pageError || error || ''} />
      ) : null}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_202px]">
        <GlassPanel className="overflow-hidden">
          <PanelHeader title="Latest Actions" />
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center text-[17px] text-[#b8c7ea]">
              <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
              Loading document workflows...
            </div>
          ) : groups.length === 0 ? (
            <div className="px-8 py-16 text-center text-[17px] text-[#b8c7ea]">
              No document workflows matched your filters.
            </div>
          ) : (
            <DocumentsList
              groups={groups}
              openGroupId={openGroupId}
              openMenuId={openMenuId}
              busyKey={busyKey}
              onToggleGroup={(groupId) =>
                setOpenGroupId((currentId) =>
                  currentId === groupId ? '' : groupId,
                )
              }
              onToggleMenu={(itemId) =>
                setOpenMenuId((current) => (current === itemId ? null : itemId))
              }
              onAction={(group, item, action) =>
                void handleDocumentAction(group, item, action)
              }
            />
          )}
        </GlassPanel>
        <DocumentsProgressPanel steps={openGroup?.progressSteps} />
      </div>
      {errorModal ? (
        <DocumentsErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal(null)}
        />
      ) : null}
    </PageShell>
  );
}
