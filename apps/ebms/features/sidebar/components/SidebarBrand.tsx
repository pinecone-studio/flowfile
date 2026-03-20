export function SidebarBrand({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-200">
        <img
          src="/pro5.png"
          alt="User"
          className="h-full w-full object-cover"
        />
      </div>
      {!isCollapsed && (
        <div className="overflow-hidden">
          <p className="truncate text-sm font-semibold text-slate-900">
            Narantsatsralt.B
          </p>
          <p className="truncate text-xs text-slate-500">
            Narantsatsralt@gmail.com
          </p>
        </div>
      )}
    </div>
  );
}
