import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DocumentsPageGroup } from '../documents.transform';

type DocumentsGroupRowProps = {
  group: DocumentsPageGroup;
  isOpen: boolean;
  onToggle: () => void;
};

export function DocumentsGroupRow({
  group,
  isOpen,
  onToggle,
}: DocumentsGroupRowProps) {
  const toneClassName =
    group.tone === 'promotion'
      ? 'bg-[#123f22] text-[#22cd35]'
      : group.tone === 'role-change'
        ? 'bg-[#5e661d] text-[#d4d91d]'
        : group.tone === 'offboarding'
          ? 'bg-[#5a1b22] text-[#ff3035]'
          : 'bg-[#173a73] text-[#2d87ff]';
  const stateTextClassName =
    group.rawJobStatus === 'completed'
      ? 'text-[#9ec2ff]'
      : group.rawJobStatus === 'canceled' || group.rawJobStatus === 'rejected'
        ? 'text-[#f0a3af]'
        : 'text-[#95a8d4]';
  return (
    <button
      type="button"
      onClick={onToggle}
      className="grid w-full grid-cols-[72px_minmax(0,1fr)_150px_54px] items-center gap-5 px-8 py-6 text-left transition hover:bg-white/[0.03]"
    >
      {group.employeeAvatar ? (
        <img
          src={group.employeeAvatar}
          alt={group.employeeName}
          className="h-[58px] w-[58px] rounded-[10px] object-cover"
        />
      ) : (
        <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[10px] bg-[#dfe7f8] text-[18px] font-semibold text-[#18335f]">
          {group.employeeName
            .split('.')
            .filter(Boolean)
            .map((value) => value.charAt(0))
            .join('')
            .slice(0, 2)}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="truncate text-[18px] font-medium text-[#eff4ff]">
            {group.employeeName}
          </span>
          <span className="text-[18px] text-[#8fa3cf]">{group.employeeCode}</span>
        </div>
        <div className={`mt-4 rounded-[10px] px-4 py-3 ${toneClassName}`}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[16px] font-semibold">{group.latestAction}</span>
            <span className={`truncate text-[16px] ${stateTextClassName}`}>
              {group.rawJobStatus === 'completed' ? 'Completed!' : group.state}
            </span>
          </div>
        </div>
      </div>
      <span className="text-right text-[16px] font-medium text-[#eef4ff]">
        {group.date}
      </span>
      <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#23478a]">
        {isOpen ? (
          <ChevronUp className="h-7 w-7 text-white" strokeWidth={2.1} />
        ) : (
          <ChevronDown className="h-7 w-7 text-white" strokeWidth={2.1} />
        )}
      </span>
    </button>
  );
}
