type DocumentsSummaryProps = {
  ongoingCount: number;
  completedCount: number;
  refreshing: boolean;
};

export function DocumentsSummary({
  ongoingCount,
  completedCount,
  refreshing,
}: DocumentsSummaryProps) {
  return (
    <div className="flex items-center gap-8 text-[16px] font-medium text-[#eef4ff]">
      <div className="flex items-center gap-3">
        <span className="h-[11px] w-[11px] rounded-full bg-[#2d87ff]" />
        <span>Ongoing {ongoingCount}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-[11px] w-[11px] rounded-full bg-[#22cd35]" />
        <span>Completed {completedCount}</span>
      </div>
      {refreshing ? <span className="text-[#bdd1ff]">Refreshing...</span> : null}
    </div>
  );
}
