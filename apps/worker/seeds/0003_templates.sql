INSERT OR REPLACE INTO templates (
  name,
  html_content,
  created_at,
  updated_at
) VALUES
(
  'employment_contract.docx',
  '<h1>Employment Contract</h1><p>Employee: {{employeeName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'probation_order.docx',
  '<h1>Probation Order</h1><p>Employee: {{employeeName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'job_description.docx',
  '<h1>Job Description</h1><p>Employee: {{employeeName}}</p><p>Action: {{actionName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'nda.docx',
  '<h1>Non-Disclosure Agreement</h1><p>Employee: {{employeeName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'salary_increase_order.docx',
  '<h1>Salary Increase Order</h1><p>Employee: {{employeeName}}</p><p>Action: {{actionName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'position_update_order.docx',
  '<h1>Position Update Order</h1><p>Employee: {{employeeName}}</p><p>Action: {{actionName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'contract_addendum.docx',
  '<h1>Contract Addendum</h1><p>Employee: {{employeeName}}</p><p>Action: {{actionName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'termination_order.docx',
  '<h1>Termination Order</h1><p>Employee: {{employeeName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
),
(
  'handover_sheet.docx',
  '<h1>Handover Sheet</h1><p>Employee: {{employeeName}}</p><p>Status: {{status}}</p>',
  datetime('now'),
  datetime('now')
);
