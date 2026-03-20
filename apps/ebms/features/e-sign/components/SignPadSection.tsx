import type { RefObject } from 'react';

type SignPadSectionProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  error: string | null;
  hasSignature: boolean;
  isApproved: boolean;
  isRejected: boolean;
  message: string | null;
  onApprove: () => void;
  onClear: () => void;
  onSave: () => void;
  submitting: boolean;
};

export function SignPadSection({
  canvasRef,
  error,
  hasSignature,
  isApproved,
  isRejected,
  message,
  onApprove,
  onClear,
  onSave,
  submitting,
}: SignPadSectionProps) {
  const isDisabled = submitting || isApproved || isRejected;

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto px-6 py-8 sm:px-8 sm:py-10">
        <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-white">
          Sign Here
        </h2>

        {message ? (
          <div className="mt-6 rounded-[14px] border border-[#255f37] bg-[#14301e] px-4 py-3 text-[15px] text-[#d1ffe0]">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-[14px] border border-[#7f2834] bg-[#39131c] px-4 py-3 text-[15px] text-[#ffd7df]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 rounded-[18px] bg-white text-black shadow-[0_18px_36px_rgba(5,10,21,0.24)]">
          <div style={{ padding: 24, minWidth: 548 }}>
            <div style={{ position: 'relative', width: 500 }}>
              <canvas
                ref={canvasRef}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  touchAction: 'none',
                  display: 'block',
                  background: '#fff',
                }}
              />
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button type="button" onClick={onClear} disabled={isDisabled}>
                Clear
              </button>
            </div>
            <div className="mt-auto border-t border-[#17325f] px-6 py-6 sm:px-8">
              <button
                type="button"
                onClick={onApprove}
                className="flex h-[70px] w-full items-center justify-center rounded-[18px] bg-[#23478a] text-[24px] font-semibold text-white transition hover:bg-[#1f407c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Approving...'
                  : isRejected
                    ? 'Rejected'
                    : isApproved
                      ? 'Approved'
                      : hasSignature
                        ? 'Approve Contract'
                        : 'Draw Signature to Approve'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
