import type { DocumentsPageItem } from '../documents.transform';

type DocumentRecipientsProps = {
  recipients: DocumentsPageItem['recipients'];
};

export function DocumentRecipients({ recipients }: DocumentRecipientsProps) {
  if (!recipients.length) {
    return <span className="text-[15px] text-[#8fa3cf]">No reviewers</span>;
  }

  return (
    <div className="flex items-center">
      {recipients.slice(0, 3).map((recipient, index) => (
        <div
          key={recipient.id}
          title={recipient.name}
          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1b315f] bg-[#dfe7f8] text-[13px] font-semibold text-[#16325d] ${
            index === 0 ? '' : '-ml-2.5'
          }`}
        >
          {recipient.initials}
        </div>
      ))}
    </div>
  );
}
