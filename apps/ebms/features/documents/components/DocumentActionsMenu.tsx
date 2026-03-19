import type {
  DocumentMenuActionKey,
  DocumentsPageGroup,
  DocumentsPageItem,
} from '../documents.transform';

type DocumentActionsMenuProps = {
  item: DocumentsPageItem;
  group: DocumentsPageGroup;
  isOpen: boolean;
  isBusy: boolean;
  onToggle: () => void;
  onAction: (action: DocumentMenuActionKey) => void;
};

export function DocumentActionsMenu({
  item,
  group,
  isOpen,
  isBusy,
  onToggle,
  onAction,
}: DocumentActionsMenuProps) {
  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        aria-label={`Open actions for ${item.title}`}
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/10"
      >
        <span className="text-[24px] leading-none">...</span>
      </button>
      <div
        className={`absolute right-0 top-full z-20 mt-2 w-[145px] overflow-hidden rounded-[10px] bg-[#255ec0] shadow-[0_24px_60px_rgba(4,10,24,0.36)] transition ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {item.menuActions.map((action) => (
          <button
            key={`${group.id}-${item.documentId}-${action.key}`}
            type="button"
            disabled={action.disabled || isBusy}
            onClick={() => onAction(action.key)}
            className={`flex min-h-[36px] w-full items-center border-b border-[#4b76c5] px-4 text-left text-[13px] font-medium text-white last:border-b-0 ${
              action.disabled || isBusy
                ? 'cursor-not-allowed opacity-45'
                : 'hover:bg-[#17489b]'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
