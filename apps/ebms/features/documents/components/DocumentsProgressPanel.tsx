import type { DocumentsProgressStep } from '../documents.transform';

type DocumentsProgressPanelProps = {
  steps?: DocumentsProgressStep[];
};

const defaultProgressSteps: DocumentsProgressStep[] = [
  { label: 'Generate 0/0', status: 'Waiting...', tone: 'neutral' },
  { label: 'Employee Signed 0/0', status: 'Waiting...', tone: 'neutral' },
  { label: 'HR Review 0/0', status: 'Waiting...', tone: 'neutral' },
  { label: 'Approval 0/0', status: 'Waiting...', tone: 'neutral' },
  { label: 'Distribution 0/0', status: 'Waiting...', tone: 'neutral' },
];

export function DocumentsProgressPanel({
  steps,
}: DocumentsProgressPanelProps) {
  const progressSteps = steps?.length ? steps : defaultProgressSteps;

  if (!steps?.length) {
    return (
      <div className="mx-auto h-[489px] w-[202px] overflow-hidden rounded-[8px] bg-[#24447e]/85 shadow-[0_24px_60px_rgba(4,10,24,0.24)] xl:mx-0">
        <div className="flex h-[44px] items-center border-b border-[#335381] bg-[#24447e]/85 px-5">
          <h2 className="text-[20px] font-semibold leading-none text-[#d0d5dc]">
            Progress
          </h2>
        </div>
        <div className="flex h-[445px] items-center justify-center px-6 text-center text-[15px] font-medium text-[#b9c8ea]">
          Select an Action
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto h-[489px] w-[202px] overflow-hidden rounded-[8px] bg-[#24447e]/85 shadow-[0_24px_60px_rgba(4,10,24,0.24)] xl:mx-0">
      <div className="flex h-[44px] items-center border-b border-[#335381] bg-[#24447e]/85 px-5">
        <h2 className="text-[20px] font-semibold leading-none text-[#d0d5dc]">
          Progress
        </h2>
      </div>

      <div className="relative flex h-[445px] flex-col">
        <div className="absolute left-[27px] top-[34px] bottom-[34px] w-px bg-[#2f4f84]" />

        {progressSteps.map((step) => {
          const toneClassName =
            step.tone === 'success'
              ? 'bg-[#32813e]'
              : step.tone === 'warning'
                ? 'bg-[#afb814]'
                : 'bg-[#202020]';

          return (
            <div
              key={step.label}
              className="relative flex min-h-0 flex-1 items-center border-b border-[#335381]/55 last:border-b-0"
            >
              <span
                className={`absolute left-[20px] h-[15px] w-[15px] rounded-full ${toneClassName}`}
              />

              <div className="pl-[46px] pr-3">
                <p className="text-[15px] font-medium leading-6 text-[#d0d5dc]">
                  {step.label}
                </p>
                <p className="mt-[1px] text-[14px] leading-5 text-[#7f94bc]">
                  {step.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
