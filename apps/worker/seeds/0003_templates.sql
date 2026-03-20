INSERT OR REPLACE INTO templates (
  name,
  html_content,
  created_at,
  updated_at
) VALUES
(
  'employmentContract.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Employment Contract</title>
    <style>
      body { font-family: "Georgia", serif; color: #1f2937; margin: 0; padding: 44px; background: #f6f7fb; }
      .sheet { max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #d7dce5; border-radius: 24px; padding: 44px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08); }
      .eyebrow { font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; color: #64748b; }
      h1 { margin: 14px 0 8px; font-size: 34px; }
      h2 { margin: 28px 0 12px; font-size: 18px; }
      p { margin: 0 0 12px; line-height: 1.75; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 22px; }
      .card { border: 1px solid #dbe4f0; border-radius: 16px; padding: 16px; background: #fbfdff; }
      .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; margin-bottom: 6px; }
      .value { font-size: 16px; font-weight: 600; color: #0f172a; }
      .footer { margin-top: 32px; padding-top: 18px; border-top: 1px solid #dbe4f0; }
      .sign { margin-top: 24px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
      .sign-box { border-top: 1px solid #334155; padding-top: 10px; min-height: 48px; }
      .mono { white-space: pre-line; font-family: "Courier New", monospace; font-size: 13px; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Employee Lifecycle Agreement</div>
      <h1>Employment Contract</h1>
      <p>This employment contract confirms the appointment of <strong>{{employeeName}}</strong> to the organization effective from <strong>{{hireDate}}</strong>. This agreement is prepared on <strong>{{currentDateOnly}}</strong> for workflow <strong>{{actionName}}</strong>.</p>
      <div class="grid">
        <section class="card">
          <div class="label">Employee</div>
          <div class="value">{{employeeName}}</div>
        </section>
        <section class="card">
          <div class="label">Employee Code</div>
          <div class="value">{{employeeCode}}</div>
        </section>
        <section class="card">
          <div class="label">Department</div>
          <div class="value">{{department}}</div>
        </section>
        <section class="card">
          <div class="label">Branch</div>
          <div class="value">{{branch}}</div>
        </section>
        <section class="card">
          <div class="label">Position Level</div>
          <div class="value">{{level}}</div>
        </section>
        <section class="card">
          <div class="label">Employee Email</div>
          <div class="value">{{email}}</div>
        </section>
      </div>
      <h2>Terms</h2>
      <p>The employee agrees to perform duties assigned to the stated position and to comply with company policies, internal rules, confidentiality requirements, and instructions issued by authorized managers.</p>
      <p>The company confirms onboarding, access provisioning, policy acknowledgement, and the signer workflow required to activate this employment record.</p>
      <h2>Workflow Signers</h2>
      <p class="mono">{{requiredSigners}}</p>
      <div class="footer">
        <p><strong>Approval Summary</strong></p>
        <p class="mono">{{approvalSummary}}</p>
        <div class="sign">
          <div class="sign-box">Employer Signature: {{signature}}</div>
          <div class="sign-box">Employee Signature: {{signature}}</div>
        </div>
      </div>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'probationOrder.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Probation Order</title>
    <style>
      body { font-family: "Georgia", serif; color: #1f2937; margin: 0; padding: 44px; background: #f8fafc; }
      .sheet { max-width: 820px; margin: 0 auto; background: white; border: 1px solid #d9e2ec; border-radius: 24px; padding: 44px; }
      .eyebrow { font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #64748b; }
      h1 { margin: 14px 0 10px; font-size: 32px; }
      p { margin: 0 0 12px; line-height: 1.75; }
      ul { margin: 12px 0 0 18px; line-height: 1.7; }
      .summary { margin-top: 24px; padding: 18px; border-radius: 18px; background: #f8fbff; border: 1px solid #dbe4f0; white-space: pre-line; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Onboarding Order</div>
      <h1>Probation Order</h1>
      <p>This order places <strong>{{employeeName}}</strong> under probation for the role assigned in <strong>{{department}}</strong> at the <strong>{{branch}}</strong> branch.</p>
      <p>The probation workflow is activated on <strong>{{currentDateOnly}}</strong> and remains subject to internal review, policy acknowledgement, and performance follow-up.</p>
      <ul>
        <li>Employee code: {{employeeCode}}</li>
        <li>Role level: {{level}}</li>
        <li>Workflow status: {{workflowStatus}}</li>
      </ul>
      <div class="summary">
Required Signers
{{requiredSigners}}

Approval Summary
{{approvalSummary}}
      </div>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'jobDescription.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Job Description</title>
    <style>
      body { font-family: "Georgia", serif; margin: 0; padding: 44px; background: linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%); color: #0f172a; }
      .sheet { max-width: 840px; margin: 0 auto; background: white; border: 1px solid #dbe4f0; border-radius: 24px; padding: 44px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08); }
      .eyebrow { color: #64748b; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; }
      h1 { margin: 14px 0 10px; font-size: 34px; }
      h2 { margin: 28px 0 10px; font-size: 18px; }
      p { margin: 0 0 12px; line-height: 1.8; }
      table { width: 100%; border-collapse: collapse; margin-top: 14px; }
      th, td { border-bottom: 1px solid #dbe4f0; padding: 12px 10px; text-align: left; vertical-align: top; }
      th { width: 28%; color: #475569; font-weight: 600; }
      .note { margin-top: 24px; padding: 18px 20px; border-radius: 18px; background: #f8fbff; border: 1px solid #dbe4f0; }
      .mono { white-space: pre-line; font-family: "Courier New", monospace; font-size: 13px; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Role Definition</div>
      <h1>Updated Job Description</h1>
      <p>This document records the active role profile for <strong>{{employeeName}}</strong> following the <strong>{{actionName}}</strong> workflow initiated on <strong>{{currentDateOnly}}</strong>.</p>
      <h2>Assignment Summary</h2>
      <table>
        <tr><th>Employee</th><td>{{employeeName}} ({{employeeCode}})</td></tr>
        <tr><th>Previous Department</th><td>{{employee.department}}</td></tr>
        <tr><th>New Department</th><td>{{department}}</td></tr>
        <tr><th>Previous Branch</th><td>{{employee.branch}}</td></tr>
        <tr><th>New Branch</th><td>{{branch}}</td></tr>
        <tr><th>Previous Level</th><td>{{employee.level}}</td></tr>
        <tr><th>New Level</th><td>{{level}}</td></tr>
      </table>
      <h2>Role Intent</h2>
      <p>The employee is expected to carry out responsibilities aligned with the updated department, branch, and level reflected above. Reporting lines, access permissions, and operational responsibilities should be adjusted to match this role definition.</p>
      <div class="note">
        <p><strong>Workflow Signers</strong></p>
        <p class="mono">{{requiredSigners}}</p>
        <p><strong>Approval Summary</strong></p>
        <p class="mono">{{approvalSummary}}</p>
      </div>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'nda.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Non-Disclosure Agreement</title>
    <style>
      body { font-family: "Georgia", serif; color: #111827; margin: 0; padding: 44px; background: #f8fafc; }
      .sheet { max-width: 820px; margin: 0 auto; background: white; border: 1px solid #dbe4f0; border-radius: 24px; padding: 44px; }
      .eyebrow { font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #64748b; }
      h1 { margin: 14px 0 10px; font-size: 32px; }
      p { margin: 0 0 14px; line-height: 1.8; }
      .footer { margin-top: 28px; padding-top: 18px; border-top: 1px solid #dbe4f0; white-space: pre-line; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Confidentiality</div>
      <h1>Non-Disclosure Agreement</h1>
      <p>This agreement binds <strong>{{employeeName}}</strong> to protect confidential, proprietary, and internal information accessed through work with the company in <strong>{{department}}</strong> at <strong>{{branch}}</strong>.</p>
      <p>The employee agrees not to disclose confidential materials except as required for legitimate business purposes or when formally authorized.</p>
      <p>The confidentiality obligation remains effective during employment and after separation according to company policy and applicable law.</p>
      <div class="footer">
Required Signers
{{requiredSigners}}

Approval Summary
{{approvalSummary}}
      </div>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'salaryIncreaseOrder.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Salary Increase Order</title>
    <style>
      body { font-family: "Georgia", serif; margin: 0; padding: 44px; background: #f7f8fc; color: #0f172a; }
      .sheet { max-width: 820px; margin: 0 auto; background: white; border: 1px solid #dbe4f0; border-radius: 24px; padding: 44px; }
      h1 { margin: 0 0 12px; font-size: 32px; }
      .eyebrow { font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #64748b; margin-bottom: 14px; }
      p { margin: 0 0 12px; line-height: 1.8; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { padding: 12px 10px; border-bottom: 1px solid #dbe4f0; text-align: left; }
      th { color: #475569; width: 34%; }
      .mono { white-space: pre-line; font-family: "Courier New", monospace; font-size: 13px; margin-top: 24px; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Compensation Change</div>
      <h1>Salary Increase Order</h1>
      <p>This order confirms a compensation-related update for <strong>{{employeeName}}</strong> under workflow <strong>{{actionName}}</strong>.</p>
      <table>
        <tr><th>Employee</th><td>{{employeeName}}</td></tr>
        <tr><th>Department</th><td>{{department}}</td></tr>
        <tr><th>Branch</th><td>{{branch}}</td></tr>
        <tr><th>Updated Level</th><td>{{level}}</td></tr>
        <tr><th>Vacation Days</th><td>{{numberOfVacationDays}}</td></tr>
        <tr><th>Salary Company Paid</th><td>{{isSalaryCompany}}</td></tr>
      </table>
      <p class="mono">Required Signers
{{requiredSigners}}

Approval Summary
{{approvalSummary}}</p>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'positionUpdateOrder.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Position Update Order</title>
    <style>
      body { font-family: "Georgia", serif; margin: 0; padding: 44px; background: #f7f9fc; color: #0f172a; }
      .sheet { max-width: 840px; margin: 0 auto; background: white; border: 1px solid #dbe4f0; border-radius: 24px; padding: 44px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08); }
      .eyebrow { color: #64748b; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; }
      h1 { margin: 14px 0 10px; font-size: 34px; }
      p { margin: 0 0 12px; line-height: 1.8; }
      .panel { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 22px; }
      .box { border: 1px solid #dbe4f0; border-radius: 18px; padding: 16px; background: #fbfdff; }
      .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; }
      .value { font-size: 18px; font-weight: 600; margin-top: 6px; }
      .mono { white-space: pre-line; font-family: "Courier New", monospace; font-size: 13px; margin-top: 24px; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Position Change Order</div>
      <h1>Position Update Order</h1>
      <p>This order authorizes the position change for <strong>{{employeeName}}</strong> and confirms the updated assignment approved under workflow <strong>{{actionName}}</strong>.</p>
      <div class="panel">
        <section class="box">
          <div class="label">Previous Department</div>
          <div class="value">{{employee.department}}</div>
        </section>
        <section class="box">
          <div class="label">Updated Department</div>
          <div class="value">{{department}}</div>
        </section>
        <section class="box">
          <div class="label">Previous Branch</div>
          <div class="value">{{employee.branch}}</div>
        </section>
        <section class="box">
          <div class="label">Updated Branch</div>
          <div class="value">{{branch}}</div>
        </section>
        <section class="box">
          <div class="label">Previous Level</div>
          <div class="value">{{employee.level}}</div>
        </section>
        <section class="box">
          <div class="label">Updated Level</div>
          <div class="value">{{level}}</div>
        </section>
      </div>
      <p class="mono">Required Signers
{{requiredSigners}}

Approval Summary
{{approvalSummary}}</p>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'contractAddendum.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Contract Addendum</title>
    <style>
      body { font-family: "Georgia", serif; margin: 0; padding: 44px; background: #eef3fb; color: #111827; }
      .sheet { max-width: 840px; margin: 0 auto; background: white; border: 1px solid #dbe4f0; border-radius: 24px; padding: 44px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08); }
      .eyebrow { font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; color: #64748b; }
      h1 { margin: 14px 0 10px; font-size: 34px; }
      h2 { margin: 28px 0 10px; font-size: 18px; }
      p { margin: 0 0 12px; line-height: 1.8; }
      .compare { width: 100%; border-collapse: collapse; margin-top: 14px; }
      .compare th, .compare td { padding: 12px 10px; border-bottom: 1px solid #dbe4f0; text-align: left; }
      .compare th { color: #475569; }
      .signature-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 28px; }
      .signature-box { min-height: 64px; border: 1px dashed #94a3b8; border-radius: 16px; padding: 14px; background: #fbfdff; }
      .mono { white-space: pre-line; font-family: "Courier New", monospace; font-size: 13px; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Employment Contract Amendment</div>
      <h1>Contract Addendum</h1>
      <p>This addendum updates the terms of employment for <strong>{{employeeName}}</strong> and forms part of the active employment contract after approval of the <strong>{{actionName}}</strong> workflow.</p>
      <h2>Amended Terms</h2>
      <table class="compare">
        <tr><th>Term</th><th>Previous</th><th>Updated</th></tr>
        <tr><td>Department</td><td>{{employee.department}}</td><td>{{department}}</td></tr>
        <tr><td>Branch</td><td>{{employee.branch}}</td><td>{{branch}}</td></tr>
        <tr><td>Level</td><td>{{employee.level}}</td><td>{{level}}</td></tr>
      </table>
      <p>All other terms of the employment agreement remain unchanged and continue in full force unless superseded by a separately approved written amendment.</p>
      <h2>Execution</h2>
      <p class="mono">Required Signers
{{requiredSigners}}

Approval Summary
{{approvalSummary}}</p>
      <div class="signature-row">
        <div class="signature-box">Employer Signature: {{signature}}</div>
        <div class="signature-box">Employee Signature: {{signature}}</div>
      </div>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'terminationOrder.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Termination Order</title>
    <style>
      body { font-family: "Georgia", serif; margin: 0; padding: 44px; background: #f8fafc; color: #111827; }
      .sheet { max-width: 820px; margin: 0 auto; background: white; border: 1px solid #dbe4f0; border-radius: 24px; padding: 44px; }
      h1 { margin: 0 0 12px; font-size: 32px; }
      .eyebrow { font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; color: #64748b; margin-bottom: 14px; }
      p { margin: 0 0 12px; line-height: 1.8; }
      .mono { white-space: pre-line; font-family: "Courier New", monospace; font-size: 13px; margin-top: 24px; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Offboarding Order</div>
      <h1>Termination Order</h1>
      <p>This order records the termination workflow for <strong>{{employeeName}}</strong> with status <strong>{{employeeStatus}}</strong>.</p>
      <p>Termination date: <strong>{{terminationDate}}</strong></p>
      <p>Department: <strong>{{department}}</strong> | Branch: <strong>{{branch}}</strong></p>
      <p class="mono">Required Signers
{{requiredSigners}}

Approval Summary
{{approvalSummary}}</p>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
),
(
  'handoverSheet.html',
  '<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Handover Sheet</title>
    <style>
      body { font-family: "Georgia", serif; margin: 0; padding: 44px; background: #f8fafc; color: #0f172a; }
      .sheet { max-width: 820px; margin: 0 auto; background: white; border: 1px solid #dbe4f0; border-radius: 24px; padding: 44px; }
      .eyebrow { font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #64748b; }
      h1 { margin: 14px 0 12px; font-size: 32px; }
      p { margin: 0 0 12px; line-height: 1.8; }
      ul { margin: 14px 0 0 18px; line-height: 1.8; }
      .mono { white-space: pre-line; font-family: "Courier New", monospace; font-size: 13px; margin-top: 24px; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="eyebrow">Offboarding Checklist</div>
      <h1>Handover Sheet</h1>
      <p>This handover sheet is prepared for <strong>{{employeeName}}</strong> to complete operational transfer before separation from the company.</p>
      <ul>
        <li>Department: {{department}}</li>
        <li>Branch: {{branch}}</li>
        <li>Termination date: {{terminationDate}}</li>
        <li>Current status: {{employeeStatus}}</li>
      </ul>
      <p class="mono">Required Signers
{{requiredSigners}}

Approval Summary
{{approvalSummary}}</p>
    </main>
  </body>
</html>',
  datetime('now'),
  datetime('now')
);
