export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="relative h-[22px] rounded-full bg-[#182a45]">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[#419645]"
        style={{ width: `${value}%` }}
      />
      {label ? (
        <span className="absolute inset-0 flex items-center justify-center px-3 text-[14px] font-medium text-[#f1f5fb]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
