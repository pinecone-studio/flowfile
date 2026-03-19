'use client';

import { startTransition, useMemo, useState } from 'react';
import { sidebarUser } from '../../showcase/showcase.data';
import { DetailNoticeBanner } from './DetailNoticeBanner';
import { triggerEmployeeAction } from './employeeDetail.api';
import { EmployeeDetailPage } from './EmployeeDetailPage';
import { toEmployeeProfile, toTriggerActions } from './employeeDetail.transform';
import type { TriggerActionDefinition } from './employeeDetail.transform';
import { getEmployeeProfile } from './employeeProfile.data';
import { TriggerActionDialog } from './TriggerActionDialog';
import { fallbackTriggerActions, buildActionDraftValues, buildTriggerPayload } from './triggerAction.helpers';
import { useEmployeeDetail } from './useEmployeeDetail';

type EmployeeDetailClientProps = {
  employeeId: string;
};

function resolveDisplayProfile(
  employeeId: string,
  detail: ReturnType<typeof useEmployeeDetail>,
) {
  const fallbackProfile = getEmployeeProfile(employeeId);

  if (!fallbackProfile || !detail.employee) {
    return fallbackProfile;
  }

  const liveProfile = toEmployeeProfile(
    detail.employee,
    detail.documents,
    detail.auditLogs,
  );

  return {
    ...fallbackProfile,
    ...liveProfile,
    image: liveProfile.image || fallbackProfile.image,
    timeline: liveProfile.timeline.length > 0 ? liveProfile.timeline : fallbackProfile.timeline,
    documents:
      liveProfile.documents.length > 0 ? liveProfile.documents : fallbackProfile.documents,
    generateOptions:
      liveProfile.documents.length > 0
        ? liveProfile.generateOptions
        : fallbackProfile.generateOptions,
  };
}

export function EmployeeDetailClient({ employeeId }: EmployeeDetailClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedAction, setSelectedAction] = useState<TriggerActionDefinition | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const detail = useEmployeeDetail(employeeId, refreshKey);
  const actions = useMemo(
    () => (detail.actions.length > 0 ? toTriggerActions(detail.actions) : fallbackTriggerActions),
    [detail.actions],
  );
  const profile = resolveDisplayProfile(employeeId, detail);

  if (!profile) {
    return null;
  }

  const handleActionSelect = (action: TriggerActionDefinition) => {
    setSelectedAction(action);
    setDraftValues(buildActionDraftValues(action, detail.employee));
    setNotice(null);
  };

  const handleDraftChange = (fieldName: string, value: string) => {
    setDraftValues((current) => ({ ...current, [fieldName]: value }));
  };

  const handleTriggerAction = async () => {
    if (!selectedAction) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await triggerEmployeeAction({
        employeeId,
        action: selectedAction.actionName,
        payload: buildTriggerPayload(selectedAction, draftValues, detail.employee),
        requestedByEmail: sidebarUser.email,
      });

      setSelectedAction(null);
      setNotice({
        tone: 'success',
        message: `${selectedAction.label} started. ${result.documentsQueued} document(s) queued.`,
      });
      startTransition(() => setRefreshKey((current) => current + 1));
    } catch (error) {
      setNotice({
        tone: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to trigger employee action.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="space-y-6">
        {notice ? <DetailNoticeBanner tone={notice.tone} message={notice.message} /> : null}
        {detail.error ? (
          <DetailNoticeBanner tone="error" message={detail.error} />
        ) : null}
        <EmployeeDetailPage
          profile={profile}
          actions={actions}
          disabled={detail.loading || isSubmitting}
          pendingActionName={isSubmitting ? selectedAction?.actionName ?? null : null}
          onActionSelect={handleActionSelect}
        />
      </section>

      <TriggerActionDialog
        action={selectedAction}
        values={draftValues}
        isSubmitting={isSubmitting}
        onChange={handleDraftChange}
        onClose={() => setSelectedAction(null)}
        onSubmit={handleTriggerAction}
      />
    </>
  );
}
