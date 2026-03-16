import { Search } from 'lucide-react';

const EmployeeSearch = () => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search employees by name, ID, department, or position..."
        className="h-[36px] w-full rounded-[10px] border border-[#c7cedd] bg-white px-4 pr-12 text-[14px] text-[#111827] outline-none placeholder:text-[#8f96a3]"
      />

      <Search className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#7b8090]" strokeWidth={1.8} />
    </div>
  );
};

export default EmployeeSearch;
