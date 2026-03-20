'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, RotateCcw } from 'lucide-react';
import SignaturePad from 'signature_pad';
import { approvalDocuments } from '../flowfile/flowfile.data';
import {
  GlassPanel,
  PageDivider,
  PageShell,
  PageTitle,
  PanelHeader,
} from '../flowfile/flowfile.ui';

type ApprovalMode = 'approve' | 'reject' | 'return';
type ApprovalStatus = 'waiting' | 'approved' | 'rejected' | 'returned';

type ApprovalDocument = {
  id: string;
  employee: string;
  name: string;
  date: string;
  time: string;
  status: ApprovalStatus;
  summary: string;
  explanationPlaceholder: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function createInitialDocuments(): ApprovalDocument[] {
  const baseDocuments: ApprovalDocument[] = approvalDocuments.length
    ? approvalDocuments.map((document, index) => ({
        ...document,
        status: 'waiting',
        summary:
          index % 2 === 0
            ? 'Salary adjustment has been prepared for final approval. Review the details and either sign, reject, or return it for revision.'
            : 'Compensation change is ready for executive review. Confirm the document and complete the final action from this panel.',
        explanationPlaceholder:
          index % 2 === 0
            ? 'Write explanation here'
            : 'Explain why this document should be sent back',
      }))
    : [
        {
          id: 'approval-row-1',
          employee: 'Narantsatsral.B',
          name: 'Salary Increase Notice',
          date: 'Jun 15, 2026',
          time: '09:14',
          status: 'waiting',
          summary:
            'Salary adjustment has been prepared for final approval. Review the details and either sign, reject, or return it for revision.',
          explanationPlaceholder: 'Write explanation here',
        },
      ];

  if (baseDocuments.length > 1) {
    return baseDocuments;
  }

  return [
    ...baseDocuments,
    {
      ...baseDocuments[0],
      id: 'approval-row-2',
      employee: 'Narantsatsral.B',
      date: 'Mar 15, 2026',
      time: '09:14',
      summary:
        'Promotion-related salary notice is waiting for your final review and signature before it can move forward.',
      explanationPlaceholder: 'Write explanation here',
    },
    {
      ...baseDocuments[0],
      id: 'approval-row-3',
      employee: 'Narantsatsralt.B',
      date: 'Mar 14, 2026',
      time: '09:14',
      summary:
        'Please verify the employee details and confirm whether the raise notice should be approved or returned.',
      explanationPlaceholder: 'Share what needs to be fixed',
    },
    {
      ...baseDocuments[0],
      id: 'approval-row-4',
      employee: 'Narantsatsral.B',
      date: 'Mar 14, 2026',
      time: '09:14',
      summary:
        'The document package is complete and waiting for approval. Use the canvas below to sign if everything looks correct.',
      explanationPlaceholder: 'Write explanation here',
    },
  ];
}

const initialDocuments = createInitialDocuments();

function ActionButton({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: 'primary' | 'danger' | 'warning';
  onClick: () => void;
}) {
  const toneClassName =
    tone === 'primary'
      ? 'bg-[#2c5299] text-white hover:bg-[#3563bb]'
      : tone === 'danger'
        ? 'border border-[#ff3638] text-[#ff3638] hover:bg-[#391419]'
        : 'border border-[#cfc012] text-[#d8d127] hover:bg-[#333310]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'flex h-[42px] items-center justify-center rounded-[10px] px-5 text-[14px] font-semibold transition',
        toneClassName
      )}
    >
      {label}
    </button>
  );
}

export default function ApprovalPage() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedId, setSelectedId] = useState(initialDocuments[0]?.id ?? '');
  const [mode, setMode] = useState<ApprovalMode>('approve');
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  const waitingDocuments = useMemo(
    () => documents.filter((document) => document.status === 'waiting'),
    [documents]
  );

  const selectedDocument =
    waitingDocuments.find((document) => document.id === selectedId) ??
    waitingDocuments[0] ??
    null;

  useEffect(() => {
    if (!selectedDocument) {
      return;
    }

    if (selectedDocument.id !== selectedId) {
      setSelectedId(selectedDocument.id);
    }
  }, [selectedDocument, selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (mode !== 'approve' || !canvas || !selectedDocument) {
      padRef.current?.off();
      padRef.current = null;
      return undefined;
    }

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.parentElement?.clientWidth ?? 360;
      const height = 220;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      padRef.current?.clear();
    };

    resizeCanvas();

    padRef.current?.off();
    padRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgba(0,0,0,0)',
      penColor: '#eef4ff',
      minWidth: 1.1,
      maxWidth: 2.4,
    });

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      padRef.current?.off();
      padRef.current = null;
    };
  }, [mode, selectedDocument]);

  useEffect(() => {
    setNote('');
    setError(null);
    padRef.current?.clear();
  }, [selectedId, mode]);

  const handleSelectAction = (documentId: string, nextMode: ApprovalMode) => {
    setSelectedId(documentId);
    setMode(nextMode);
    setFeedback(null);
    setError(null);
  };

  const handleSubmit = () => {
    if (!selectedDocument) {
      return;
    }

    if (mode === 'approve' && padRef.current?.isEmpty()) {
      setError('Please sign before approving this document.');
      setFeedback(null);
      return;
    }

    if ((mode === 'reject' || mode === 'return') && !note.trim()) {
      setError('Please add an explanation before continuing.');
      setFeedback(null);
      return;
    }

    const nextStatus: ApprovalStatus =
      mode === 'approve'
        ? 'approved'
        : mode === 'reject'
          ? 'rejected'
          : 'returned';

    setDocuments((current) =>
      current.map((document) =>
        document.id === selectedDocument.id
          ? { ...document, status: nextStatus }
          : document
      )
    );

    setFeedback(
      mode === 'approve'
        ? `${selectedDocument.name} approved successfully.`
        : mode === 'reject'
          ? `${selectedDocument.name} rejected with explanation.`
          : `${selectedDocument.name} returned for revision.`
    );
    setError(null);
    setNote('');
    padRef.current?.clear();
  };

  return (
    <PageShell className="gap-6">
      <div className="text-[18px] font-medium text-[#9fb2d9]">Sign &amp; Approve</div>

      <PageTitle
        title="Approval"
        subtitle={<p className="text-[15px] text-[#eef4ff]">Sign and approve documents if needed</p>}
      />

      <PageDivider />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <GlassPanel className="overflow-hidden">
          <PanelHeader title="Document Preview" />

          <div className="min-h-[660px] bg-[radial-gradient(circle_at_30%_20%,rgba(86,113,170,0.12),transparent_26%),linear-gradient(180deg,rgba(10,20,41,0.72)_0%,rgba(7,13,28,0.92)_100%)] p-6 md:p-8">
            {selectedDocument ? (
              <div className="flex h-full flex-col gap-6">
                <div className="rounded-[18px] border border-[#28436d] bg-[linear-gradient(180deg,rgba(17,29,53,0.96)_0%,rgba(13,23,44,0.92)_100%)] p-5 shadow-[0_24px_60px_rgba(3,8,20,0.35)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[14px] text-[#8ca0ca]">{selectedDocument.employee}</p>
                      <h2 className="mt-1 text-[24px] font-semibold text-[#f4f8ff]">
                        {selectedDocument.name}
                      </h2>
                    </div>

                    <div className="text-right text-[14px] leading-5 text-[#d6e1f8]">
                      <p>{selectedDocument.date}</p>
                      <p>{selectedDocument.time}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[16px] border border-[#243c66] bg-[#0f1a31]/95 p-5 text-[#d9e4fb]">
                    <div className="flex items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-[#6f85b4]">
                      <FileText className="h-4 w-4" />
                      Preview
                    </div>
                    <p className="mt-4 text-[15px] leading-7 text-[#dce6fb]">
                      {selectedDocument.summary}
                    </p>
                    <div className="mt-5 rounded-[14px] border border-dashed border-[#375688] px-4 py-3 text-[13px] text-[#8aa0cc]">
                      Selected action:{' '}
                      <span className="font-semibold uppercase text-[#eef4ff]">{mode}</span>
                    </div>
                  </div>
                </div>

                {feedback ? (
                  <div className="rounded-[14px] border border-[#275e39] bg-[#14311e] px-4 py-3 text-[14px] text-[#d2ffe0]">
                    {feedback}
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-[14px] border border-[#8e2a37] bg-[#35121a] px-4 py-3 text-[14px] text-[#ffdce2]">
                    {error}
                  </div>
                ) : null}

                <div className="mt-auto rounded-[18px] border border-[#243b62] bg-[#111d35]/92 p-5">
                  {mode === 'approve' ? (
                    <>
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="text-[18px] font-semibold text-[#eef4ff]">Sign Here</h3>
                        <button
                          type="button"
                          onClick={() => padRef.current?.clear()}
                          className="inline-flex items-center gap-2 rounded-[10px] border border-[#2e4f83] px-3 py-2 text-[13px] font-medium text-[#d9e5fb] transition hover:bg-white/5"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Clear
                        </button>
                      </div>

                      <div className="rounded-[16px] bg-[#5d6472] p-0">
                        <canvas ref={canvasRef} className="block w-full rounded-[16px] touch-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="mb-4 text-[18px] font-semibold text-[#eef4ff]">
                        {mode === 'reject' ? 'Reject Form' : 'Return Form'}
                      </h3>
                      <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder={selectedDocument.explanationPlaceholder}
                        className="min-h-[220px] w-full resize-none rounded-[16px] border border-[#2f4c79] bg-[#59606c] px-4 py-4 text-[15px] text-white placeholder:text-[#e5e8ef]/70 focus:outline-none"
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={cx(
                      'mt-5 flex h-[52px] w-full items-center justify-center rounded-[12px] text-[18px] font-semibold transition',
                      mode === 'approve'
                        ? 'bg-[#2450a2] text-white hover:bg-[#2c5fc1]'
                        : mode === 'reject'
                          ? 'bg-[#8f241f] text-white hover:bg-[#a42d27]'
                          : 'bg-[#7d8219] text-[#101606] hover:bg-[#969d22]'
                    )}
                  >
                    {mode === 'approve'
                      ? 'Approve'
                      : mode === 'reject'
                        ? 'Reject'
                        : 'Return'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[560px] items-center justify-center rounded-[18px] border border-[#22395f] bg-[#0b1426]/70 p-8 text-center text-[#c6d4f1]">
                <div>
                  <p className="text-[22px] font-medium text-[#dbe5fb]">No waiting documents</p>
                  <p className="mt-3 text-[16px] text-[#92a6d3]">
                    All approval requests have already been processed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="overflow-hidden">
          <PanelHeader title="Waiting Documents" />

          <div className="min-h-[660px] bg-[linear-gradient(180deg,rgba(28,47,84,0.92)_0%,rgba(21,35,62,0.92)_100%)] p-4">
            {waitingDocuments.length > 0 ? (
              <div className="space-y-3">
                {waitingDocuments.map((document) => {
                  const isSelected = selectedDocument?.id === document.id;

                  return (
                    <div
                      key={document.id}
                      className={cx(
                        'rounded-[14px] border px-4 py-4 transition',
                        isSelected
                          ? 'border-[#3d65a3] bg-[#223b69]'
                          : 'border-[#304a76] bg-[#1c2f53]'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(document.id);
                          setFeedback(null);
                          setError(null);
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] text-[#8ea2cb]">{document.employee}</p>
                            <p className="mt-1 text-[15px] font-medium text-[#eef4ff]">
                              {document.name}
                            </p>
                          </div>

                          <div className="text-right text-[11px] leading-4 text-[#d7e1f7]">
                            <p>{document.date}</p>
                            <p>{document.time}</p>
                          </div>
                        </div>
                      </button>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <ActionButton
                          label="Sign & Approve"
                          tone="primary"
                          onClick={() => handleSelectAction(document.id, 'approve')}
                        />
                        <ActionButton
                          label="Reject"
                          tone="danger"
                          onClick={() => handleSelectAction(document.id, 'reject')}
                        />
                        <ActionButton
                          label="Return"
                          tone="warning"
                          onClick={() => handleSelectAction(document.id, 'return')}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[580px] items-center justify-center rounded-[16px] border border-dashed border-[#34507c] text-center">
                <div className="px-6">
                  <p className="text-[18px] font-semibold text-[#ecf3ff]">Queue is empty</p>
                  <p className="mt-2 text-[14px] text-[#91a5d2]">
                    New approval requests will appear here automatically.
                  </p>
                </div>
              </div>
            )}

            {documents.some((document) => document.status !== 'waiting') ? (
              <div className="mt-5 rounded-[16px] border border-[#2f4a75] bg-[#162744]/90 p-4">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8299c6]">
                  Processed
                </p>
                <div className="mt-3 space-y-2">
                  {documents
                    .filter((document) => document.status !== 'waiting')
                    .map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between rounded-[12px] bg-[#101d35] px-3 py-2 text-[13px]"
                      >
                        <span className="text-[#dfe8fb]">{document.name}</span>
                        <span
                          className={cx(
                            'font-semibold uppercase',
                            document.status === 'approved'
                              ? 'text-[#35d86a]'
                              : document.status === 'rejected'
                                ? 'text-[#ff5a58]'
                                : 'text-[#d8d127]'
                          )}
                        >
                          {document.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  );
}
