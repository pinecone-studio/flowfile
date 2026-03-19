type DocumentsAlertProps = {
  message: string;
};

export function DocumentsAlert({ message }: DocumentsAlertProps) {
  return (
    <div className="rounded-[14px] border border-[#7f2834] bg-[#39131c] px-5 py-4 text-[15px] text-[#ffd7df]">
      {message}
    </div>
  );
}
