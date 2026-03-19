export function MetricLegend({
  items,
}: {
  items: Array<{ label: string; value: string; color: string }>;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-10 text-[18px] text-[#edf2ff]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium">
            {item.label} {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
