CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  entra_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name_eng TEXT,
  last_name_eng TEXT,
  email TEXT,
  image_url TEXT,
  hire_date TEXT,
  number_of_vacation_days INTEGER,
  termination_date TEXT,
  status TEXT NOT NULL,
  github TEXT,
  department TEXT,
  branch TEXT,
  employee_code TEXT NOT NULL UNIQUE,
  level TEXT,
  is_kpi INTEGER NOT NULL DEFAULT 0,
  is_salary_company INTEGER NOT NULL DEFAULT 0,
  birth_day_and_month TEXT,
  birthday_poster TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employees_employee_code
ON employees(employee_code);

CREATE INDEX IF NOT EXISTS idx_employees_department
ON employees(department);

CREATE INDEX IF NOT EXISTS idx_employees_branch
ON employees(branch);

CREATE INDEX IF NOT EXISTS idx_employees_status
ON employees(status);