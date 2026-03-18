<<<<<<< HEAD
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@team-4/shadcn';
=======
// import Link from 'next/link';
// import { SidebarItem } from '../../../lib/sidebar/sidebar.types';

// type SidebarNavItemProps = {
//   item: SidebarItem;
//   isActive: boolean;
// };

// export function SidebarNavItem({ item, isActive }: SidebarNavItemProps) {
//   const Icon = item.icon;

//   return (
//     <Link
//       href={item.href}
//       className={[
//         'mx-0 flex h-[32px] items-center gap-3 rounded-none px-4 text-[14px] transition-colors',
//         isActive
//           ? 'bg-white font-medium text-[#111827]'
//           : 'text-[#2f3440] hover:bg-white/80 hover:text-[#111827]',
//       ].join(' ')}
//     >
//       <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
//       <span>{item.label}</span>
//     </Link>
//   );
// }


>>>>>>> d828d3c (ui: hide scrollbar in DocumentPanel)
import Link from 'next/link';
import { SidebarItem } from '../../../lib/sidebar/sidebar.types';
import type { SidebarTone } from './sidebarTheme';

type SidebarNavItemProps = {
  item: SidebarItem;
  isActive: boolean;
<<<<<<< HEAD
  tone: SidebarTone;
};

const navItemToneClasses: Record<
  SidebarTone,
  { button: string; badge: string }
> = {
  light: {
    button:
      'text-[#4b5563] hover:bg-white/75 hover:text-[#111827] data-[active=true]:bg-white data-[active=true]:text-[#111827] data-[active=true]:shadow-[0_1px_2px_rgba(15,23,42,0.08)]',
    badge: 'bg-[#dff6e5] text-[#197a33]',
  },
  dark: {
    button:
      'text-[#737378] hover:bg-[#161616] hover:text-[#d1d1d6] data-[active=true]:bg-[#1d1d1d] data-[active=true]:text-[#f5f5f5]',
    badge: 'bg-[#163b1f] text-[#6fdc84]',
  },
};

export function SidebarNavItem({ item, isActive, tone }: SidebarNavItemProps) {
=======
  isCollapsed: boolean;
};

export function SidebarNavItems({ item, isActive, isCollapsed }: SidebarNavItemProps) {
>>>>>>> d828d3c (ui: hide scrollbar in DocumentPanel)
  const Icon = item.icon;
  const toneClasses = navItemToneClasses[tone];

  return (
<<<<<<< HEAD
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={[
          'h-[36px] gap-[12px] rounded-[12px] px-[12px] text-[14px] leading-none',
          toneClasses.button,
        ].join(' ')}
      >
        <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          <span className="truncate">{item.label}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge ? (
        <SidebarMenuBadge
          className={[
            'right-[12px] top-1/2 h-[18px] min-w-[18px] -translate-y-1/2 rounded-[6px] px-[5px] text-[10px] font-medium',
            toneClasses.badge,
          ].join(' ')}
        >
          {item.badge}
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
=======
    <Link
      href={item.href}
      className={`
        mx-2 flex h-10 items-center gap-3 rounded-lg px-3 transition-all
        ${isActive 
          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
      `}
    >
      <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-600' : ''}`} strokeWidth={2} />
      
      {!isCollapsed && (
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium">{item.label}</span>
          {/* Хэрэв notification badge байгаа бол (Documents 6 гэх мэт) */}
          {item.label === 'Documents' && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
              6
            </span>
          )}
        </div>
      )}
    </Link>
>>>>>>> d828d3c (ui: hide scrollbar in DocumentPanel)
  );
}