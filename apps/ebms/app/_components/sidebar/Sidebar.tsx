import { SidebarNav } from './SidebarNav';

export function Sidebar() {
  return (
    <aside className="hidden w-[188px] shrink-0 border-r border-[#cdd4e2] bg-[#dfe4f1] md:block">
      <SidebarNav />
    </aside>
  );
}
