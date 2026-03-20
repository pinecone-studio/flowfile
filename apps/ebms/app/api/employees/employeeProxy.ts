const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8787'
).replace(/\/+$/, '');

const employeeFields = `
  id
  entraId
  firstName
  lastName
  firstNameEng
  lastNameEng
  email
  imageUrl
  hireDate
  numberOfVacationDays
  terminationDate
  status
  github
  department
  branch
  employeeCode
  level
  isKpi
  isSalaryCompany
  birthDayAndMonth
  birthdayPoster
  createdAt
  updatedAt
`;

type ProxyResponse = {
  status: number;
  body: string;
  contentType: string;
};

type GraphQLPayload<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

async function requestGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const payload = (rawText ? JSON.parse(rawText) : null) as GraphQLPayload<T> | null;

  if (payload?.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'GraphQL request failed');
  }

  if (!payload?.data) {
    throw new Error('GraphQL response returned no data');
  }

  return payload.data;
}

async function requestEmployeesViaGraphQL() {
  const data = await requestGraphQL<{ employees: unknown[] }>(/* GraphQL */ `
    query EmployeesProxyFallback {
      employees {
        ${employeeFields}
      }
    }
  `);

  return data.employees;
}

async function requestEmployeeByIdViaGraphQL(id: string) {
  const data = await requestGraphQL<{ employee: unknown | null }>(
    /* GraphQL */ `
      query EmployeeProxyFallback($id: String!) {
        employee(id: $id) {
          ${employeeFields}
        }
      }
    `,
    { id },
  );

  return data.employee;
}

async function requestProtectedEmployeePath(
  path: string,
  token: string | null,
): Promise<ProxyResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  const rawText = await response.text();

  return {
    status: response.status,
    body: rawText,
    contentType: response.headers.get('Content-Type') || 'application/json',
  };
}

export async function proxyEmployeesIndex(token: string | null): Promise<ProxyResponse> {
  const protectedResponse = await requestProtectedEmployeePath('/employees', token);

  if (protectedResponse.status !== 401) {
    return protectedResponse;
  }

  try {
    const employees = await requestEmployeesViaGraphQL();

    return {
      status: 200,
      body: JSON.stringify(employees),
      contentType: 'application/json',
    };
  } catch {
    return protectedResponse;
  }
}

export async function proxyEmployeeById(
  id: string,
  token: string | null,
): Promise<ProxyResponse> {
  const protectedResponse = await requestProtectedEmployeePath(
    `/employees/${id}`,
    token,
  );

  if (protectedResponse.status !== 401) {
    return protectedResponse;
  }

  try {
    const employee = await requestEmployeeByIdViaGraphQL(id);

    if (!employee) {
      return {
        status: 404,
        body: JSON.stringify({ message: 'Employee not found' }),
        contentType: 'application/json',
      };
    }

    return {
      status: 200,
      body: JSON.stringify(employee),
      contentType: 'application/json',
    };
  } catch {
    return protectedResponse;
  }
}
