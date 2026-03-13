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

employeeRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  const employee = await employeeService.updateEmployee(c.env, id, body);

  if (!employee) {
    return c.json({ message: 'Employee not found' }, 404);
  }

  return c.json(employee);
});

export default employeeRoutes;
