import { Hono } from 'hono';
import { EmployeeService } from './employee.service';

type Env = {
  Bindings: {
    DB: D1Database;
    DOCS_BUCKET: R2Bucket;
    EPAS_WEBHOOK_URL?: string;
  };
};

const employeeRoutes = new Hono<Env>();
const employeeService = new EmployeeService();

employeeRoutes.get('/', async (c) => {
  const employees = await employeeService.listEmployees(c.env);
  return c.json(employees);
});

employeeRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const employee = await employeeService.getEmployeeById(c.env, id);

  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404);
  }

  return c.json(employee);
});

employeeRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const employee = await employeeService.createEmployee(c.env, body);

  return c.json(employee, 201);
});

employeeRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();

    const validationError = validateCreateEmployeeInput(body);
    if (validationError) {
      return c.json({ message: validationError }, 400);
    }

    const employee = await employeeService.createEmployee(c.env, body);
    return c.json(employee, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('Employee code already exists')) {
      return c.json({ message }, 409);
    }

    console.error('CREATE EMPLOYEE ERROR:', error);
    return c.json({ message: 'Failed to create employee' }, 500);
  }
});

employeeRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  const employee = await employeeService.updateEmployee(c.env, id, body);

  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404);
  }

  return c.json(employee);
});

employeeRoutes.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    if (!body || Object.keys(body).length === 0) {
      return c.json({ message: 'No fields provided for update' }, 400);
    }

    const employee = await employeeService.updateEmployee(c.env, id, body);

    if (!employee) {
      return c.json({ message: 'Employee not found' }, 404);
    }

    return c.json(employee);
  } catch (error) {
    console.error('UPDATE EMPLOYEE ERROR:', error);
    return c.json({ message: 'Failed to update employee' }, 500);
  }
});

function validateCreateEmployeeInput(body: any) {
  if (!body.firstName) return 'firstName is required';
  if (!body.lastName) return 'lastName is required';
  if (!body.status) return 'status is required';
  if (!body.employeeCode) return 'employeeCode is required';
  return null;
}

export default employeeRoutes;
