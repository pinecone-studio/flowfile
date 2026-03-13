'use client';

type AddEmployeeButtonProps = {
  onClick: () => void;
};

const AddEmployeeButton = ({ onClick }: AddEmployeeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[32px] items-center rounded-[6px] border border-[#c4cad6] bg-white px-4 text-[14px] font-medium text-[#111827] transition hover:bg-[#f8fafc]"
    >
      Add Employee
    </button>
  );
};

export default AddEmployeeButton;
