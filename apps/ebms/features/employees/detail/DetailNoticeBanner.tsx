type DetailNoticeBannerProps = {
  tone: 'success' | 'error';
  message: string;
};

const toneClassNames = {
  success: 'border-[#2d7a3f]/60 bg-[#112d1a]/88 text-[#d8ffe0]',
  error: 'border-[#8a3743]/60 bg-[#32121a]/88 text-[#ffe1e6]',
};

export function DetailNoticeBanner({
  tone,
  message,
}: DetailNoticeBannerProps) {
  return (
    <div
      className={`whitespace-pre-line rounded-[18px] border px-5 py-4 text-[15px] font-medium shadow-[0_18px_48px_rgba(4,9,22,0.16)] ${toneClassNames[tone]}`}
    >
      {message}
    </div>
  );
}
