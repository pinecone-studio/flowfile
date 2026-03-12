import { AddEmployeeDialog } from './_components/employees/AddEmployeeDialog';

export const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-6">
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Employee Paperwork Automation System
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Employees
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Create a new employee record and trigger the onboarding paperwork
              flow for the add_employee action.
            </p>
          </div>

          <AddEmployeeDialog />
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            Employee list area
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Table and generated document status can be added here next.
          </p>
        </div>
      </section>
    </main>
  );
};