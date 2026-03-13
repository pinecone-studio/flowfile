// import DocumentPanel from './DocumentPanel';
// import EmployeeStats from './EmployeeStats';
// import EmployeeTable from './EmployeeTable';

// const EmployeePage = () => {
//   return (
//     <main className="min-h-screen bg-[#F1F5F9] px-3 py-3">
//       <div className="mx-auto max-w-[1440px]">
//         <div className="flex flex-col gap-5">
//           <div className="">
//             <EmployeeStats />
//           </div>

//           <div className="gap-5 flex">
//             <EmployeeTable />
//             <DocumentPanel />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default EmployeePage;

import DocumentPanel from './DocumentPanel';
import EmployeeStats from './EmployeeStats';
import EmployeeTable from './EmployeeTable';

const EmployeePage = () => {
  return (
    <main className="min-h-screen bg-[#F1F5F9] px-3 py-3">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-5">
          <div className="">
            <EmployeeStats />
          </div>

          <div className="gap-5 flex">
            <EmployeeTable />
            <DocumentPanel />
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmployeePage;
