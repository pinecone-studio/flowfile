import type {
  DocumentMenuActionKey,
  DocumentsPageGroup,
  DocumentsPageItem,
} from '../documents.transform';
import { StatusDotLabel, StatusText } from '../../flowfile/flowfile.ui';
import { DocumentActionsMenu } from './DocumentActionsMenu';
import { DocumentsGroupRow } from './DocumentsGroupRow';
import { DocumentRecipients } from './DocumentRecipients';

type DocumentsListProps = {
  groups: DocumentsPageGroup[];
  openGroupId: string;
  openMenuId: string | null;
  busyKey: string | null;
  onToggleGroup: (groupId: string) => void;
  onToggleMenu: (itemId: string) => void;
  onAction: (
    group: DocumentsPageGroup,
    item: DocumentsPageItem,
    action: DocumentMenuActionKey,
  ) => void;
};

export function DocumentsList({
  groups,
  openGroupId,
  openMenuId,
  busyKey,
  onToggleGroup,
  onToggleMenu,
  onAction,
}: DocumentsListProps) {
  return (
    <div>
      {groups.map((group) => {
        const isOpen = openGroupId === group.id;
        return (
          <div key={group.id}>
            <DocumentsGroupRow
              group={group}
              isOpen={isOpen}
              onToggle={() => onToggleGroup(group.id)}
            />
            {isOpen ? (
              <div className="bg-[#305393]/78 px-8 py-6">
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid min-h-[48px] grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)_minmax(0,0.95fr)_minmax(0,1.55fr)_36px] items-center gap-5"
                    >
                      <span className="truncate text-[18px] font-medium text-[#f3f7ff]">{item.title}</span>
                      <div className="flex min-h-[48px] flex-col justify-center">
                        <StatusText value={item.statusLabel} />
                        <span className="text-[16px] leading-4 text-[#a0b0d3]">{item.timestamp}</span>
                      </div>
                      <StatusDotLabel label={item.pendingLabel} tone={item.pendingTone} />
                      <div className="flex items-start gap-3">
                        <span className="pt-1 text-[16px] text-[#eef4ff]">Signers</span>
                        <DocumentRecipients recipients={item.recipients} />
                      </div>
                      <DocumentActionsMenu
                        item={item}
                        group={group}
                        isOpen={openMenuId === item.id}
                        isBusy={busyKey === `${group.id}:retry` || busyKey === `${group.id}:cancel`}
                        onToggle={() => onToggleMenu(item.id)}
                        onAction={(action) => onAction(group, item, action)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
