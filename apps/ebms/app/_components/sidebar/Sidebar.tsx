import { SidebarBrand } from './SidebarBrand';
import { SidebarNav } from './SidebarNav';

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-slate-100 md:block">
      <SidebarBrand />
      <SidebarNav />
    </aside>
  );
}