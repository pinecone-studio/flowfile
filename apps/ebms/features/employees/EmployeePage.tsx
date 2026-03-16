
import DocumentPanel from './components/DocumentPanel';
import EmployeeStats from './components/EmployeeStats';
import EmployeeTable from './components/EmployeeTable';

const EmployeePage = () => {
  return (
    <section className="px-4 py-4">
      <div className="mx-auto flex max-w-[1328px] flex-col gap-4">
        <EmployeeStats />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_376px]">
          <EmployeeTable />
          <DocumentPanel />
        </div>
      </div>
    </section>
  );
};

export default EmployeePage;
