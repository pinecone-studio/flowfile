export type DocumentsCategoryKey =
  | 'all'
  | 'add_employee'
  | 'salary_increase'
  | 'change_position'
  | 'offboard_employee';

export type DocumentMenuActionKey =
  | 'download'
  | 'sign'
  | 'audit'
  | 'error'
  | 'retry'
  | 'cancel';

export type DocumentMenuAction = {
  key: DocumentMenuActionKey;
  label: string;
  disabled?: boolean;
};

export type DocumentRecipient = {
  id: string;
  name: string;
  initials: string;
};

export type DocumentsPageItem = {
  id: string;
  documentId: string;
  title: string;
  statusLabel: string;
  timestamp: string;
  pendingLabel: string;
  pendingTone: 'success' | 'warning' | 'neutral';
  recipients: DocumentRecipient[];
  menuActions: DocumentMenuAction[];
  downloadUrl: string;
  signToken: string | null;
  errorMessage: string | null;
  rawStatus: string;
};

export type DocumentsProgressStep = {
  label: string;
  status: string;
  tone: 'success' | 'warning' | 'neutral';
};

export type DocumentsPageGroup = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  employeeAvatar: string | null;
  date: string;
  latestAction: string;
  state: string;
  categoryKey: DocumentsCategoryKey;
  rawJobStatus: string;
  actionName: string;
  tone: 'onboarding' | 'promotion' | 'role-change' | 'offboarding';
  progressSteps: DocumentsProgressStep[];
  items: DocumentsPageItem[];
};

export type DocumentsPageModel = {
  categories: Array<{
    key: DocumentsCategoryKey;
    label: string;
    count: number;
  }>;
  groups: DocumentsPageGroup[];
  ongoingCount: number;
  completedCount: number;
};
