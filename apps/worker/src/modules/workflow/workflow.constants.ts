export const REVIEW_LINK_TTL_DAYS = 7;

export const payloadEmailByRole: Record<string, string[]> = {
  department_chief: [
    'departmentChiefEmail',
    'approverEmail',
    'higherEmployeeEmail',
  ],
  branch_manager: [
    'branchManagerEmail',
    'approverEmail',
    'higherEmployeeEmail',
  ],
  ceo: ['ceoEmail', 'approverEmail'],
  manager: ['managerEmail', 'approverEmail', 'higherEmployeeEmail'],
  approver: ['approverEmail', 'higherEmployeeEmail', 'managerEmail'],
  hr_team: ['hrEmail', 'requestedByEmail'],
};

export const genericApproverFields = [
  'approverEmail',
  'higherEmployeeEmail',
  'managerEmail',
  'departmentChiefEmail',
  'branchManagerEmail',
  'ceoEmail',
];

export const generatedNotificationRecipientSpecs = [
  {
    role: 'clo',
    payloadKeys: ['cloEmail', 'legalEmail', 'chiefLegalOfficerEmail'],
    recipientRoleKeys: ['clo', 'chief_legal_officer', 'legal'],
  },
  {
    role: 'hr_management',
    payloadKeys: ['hrManagementEmail', 'hrEmail'],
    recipientRoleKeys: ['hr_management', 'hr_team'],
  },
] as const;