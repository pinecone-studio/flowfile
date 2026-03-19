import { MoreHorizontal } from "lucide-react";

export function OverflowAction() {
  return (
    <button
      type="button"
      aria-label="Open row actions"
      className="flex h-9 w-9 items-center justify-center rounded-full text-[#eef2fb]"
    >
      <MoreHorizontal className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
}