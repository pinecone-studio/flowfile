INSERT OR REPLACE INTO recipients (
  id,
  role_key,
  recipient_name,
  recipient_email,
  department,
  branch,
  is_active,
  created_at,
  updated_at
) VALUES
(
  'recipient-hr-team',
  'hr_team',
  'HR Team',
  'hr@demo.epas.local',
  NULL,
  NULL,
  1,
  datetime('now'),
  datetime('now')
),
(
  'recipient-department-chief',
  'department_chief',
  'Department Chief',
  'chief@demo.epas.local',
  NULL,
  NULL,
  1,
  datetime('now'),
  datetime('now')
),
(
  'recipient-branch-manager',
  'branch_manager',
  'Branch Manager',
  'branch.manager@demo.epas.local',
  NULL,
  NULL,
  1,
  datetime('now'),
  datetime('now')
),
(
  'recipient-ceo',
  'ceo',
  'Chief Executive Officer',
  'ceo@demo.epas.local',
  NULL,
  NULL,
  1,
  datetime('now'),
  datetime('now')
);
