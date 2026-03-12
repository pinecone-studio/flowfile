'use client';

type AddEmployeeButtonProps = {
  onClick: () => void;
};

export const AddEmployeeButton = ({
  onClick,
}: AddEmployeeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      Add Employee
    </button>
  );
};