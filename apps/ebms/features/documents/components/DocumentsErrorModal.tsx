type DocumentsErrorModalProps = {
  title: string;
  message: string;
  onClose: () => void;
};

export function DocumentsErrorModal({
  title,
  message,
  onClose,
}: DocumentsErrorModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#020611]/70 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-[520px] rounded-[20px] border border-white/10 bg-[#10213f] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[24px] font-semibold text-white">{title}</h2>
            <p className="mt-3 text-[16px] leading-7 text-[#c5d4f4]">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-white/8 px-3 py-2 text-[14px] text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
