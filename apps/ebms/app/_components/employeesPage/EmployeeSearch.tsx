

const EmployeeSearch = () => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search employees by name, ID, department, or position..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-14 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300"
      />

      <button
        type="button"
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg hover:bg-slate-100"
      >
        <img src='Vector.svg' alt="search" className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EmployeeSearch;