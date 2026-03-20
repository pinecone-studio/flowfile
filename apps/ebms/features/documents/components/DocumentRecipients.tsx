import { formatDateTime } from '../documents.formatters';
import type { DocumentsPageItem } from '../documents.transform';

type DocumentRecipientsProps = {
  recipients: DocumentsPageItem['recipients'];
};

const statusClassNames = {
  signed: 'border-[#235e33] bg-[#12311c] text-[#8cf0a3]',
  waiting: 'border-[#5a4a23] bg-[#31260f] text-[#ffd27a]',
  rejected: 'border-[#673042] bg-[#341420] text-[#ff9bb0]',
};

const statusLabels = {
  signed: 'Signed',
  waiting: 'Waiting',
  rejected: 'Rejected',
};

export function DocumentRecipients({ recipients }: DocumentRecipientsProps) {
  if (!recipients.length) {
    return <span className="text-[15px] text-[#8fa3cf]">No reviewers</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {recipients.map((recipient) => (
        <div
          key={recipient.id}
          title={`${recipient.name} • ${recipient.role} • ${statusLabels[recipient.status]}${
            recipient.approvedAt ? ` • ${formatDateTime(recipient.approvedAt)}` : ''
          }`}
          className={`flex min-h-[34px] items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium ${statusClassNames[recipient.status]}`}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[11px] font-semibold text-[#16325d]">
            {recipient.initials}
          </span>
          <span className="whitespace-nowrap">
            {recipient.name} • {recipient.role} • {statusLabels[recipient.status]}
          </span>
        </div>
      ))}
    </div>
  );
}
