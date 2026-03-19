import type { EmployeeCardRecord } from './showcase.data';
import { TonePill } from './components/TonePill';

export function EmployeePreviewCard({
  record,
}: {
  record: EmployeeCardRecord;
}) {
  const params = new URLSearchParams({
    users: record.email,
    message: 'Hello there!',
  });

  const teamsHref = `https://teams.microsoft.com/l/chat/0/0?${params.toString()}`;

  return (
    <article className="rounded-[38px] border border-[#274579]/60 bg-[#142449]/72 p-4 shadow-[0_24px_60px_rgba(5,10,23,0.28)] backdrop-blur-[18px]">
      <div className="relative overflow-hidden rounded-[34px]">
        <img
          src={record.image}
          alt={record.name}
          className="h-[332px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,25,0)_42%,rgba(7,14,25,0.25)_68%,rgba(5,10,19,0.86)_100%)]" />
        <TonePill
          label={record.status}
          tone={record.statusTone}
          compact
          className="absolute left-5 top-5"
        />
        <div className="absolute inset-x-5 bottom-5">
          <p className="text-[15px] font-medium text-white/72">{record.role}</p>
          <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-white">
            {record.name}
          </h3>
        </div>
      </div>

      <div className="px-2 pb-2 pt-6 text-[#d7dff0]">
        <p className="text-[15px] font-medium">
          Email:{' '}
          <a href={teamsHref} target="_blank" rel="noreferrer">
            {record.email}
          </a>
        </p>
        <p className="mt-6 text-[15px] text-[#c6d0e4]">Latest Action:</p>

        <div className="mt-3 flex items-center gap-4">
          <TonePill
            label={record.latestAction}
            tone={record.actionTone}
            className="h-[40px]"
          />
          <span className="text-[16px] font-medium text-[#dce3f1]">
            {record.latestDate}
          </span>
        </div>

        <button
          type="button"
          className="mt-7 flex h-[62px] w-full items-center justify-center rounded-[26px] bg-[#284661] text-[18px] font-semibold text-[#dfe8f6] transition hover:bg-[#30516f]"
        >
          View Profile
        </button>
      </div>
    </article>
  );
}
