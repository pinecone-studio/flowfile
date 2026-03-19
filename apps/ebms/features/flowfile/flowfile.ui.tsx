import type { ReactNode } from 'react';
import { ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import type { FlowTone } from './flowfile.data';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const toneStyles: Record<FlowTone, string> = {
  active: 'bg-[#113915] text-[#1fd537]',
  inactive: 'bg-[#2a2a2d] text-[#80838c]',
  onboarding: 'bg-[#1c4188] text-[#2c87ff]',
  promotion: 'bg-[#124820] text-[#16c736]',
  'role-change': 'bg-[#5b6322] text-[#d3d320]',
  terminate: 'bg-[#5a2024] text-[#ff2b2d]',
  pending: 'bg-[#5d6f33] text-[#e2e8b6]',
  warning: 'text-[#c5c019]',
  success: 'text-[#24cd35]',
  failed: 'bg-[#b7252f]',
  neutral: 'bg-[#20242d]',
};

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx('mx-auto flex w-full max-w-[1512px] flex-col gap-8 pb-10', className)}>
      {children}
    </section>
  );
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[38px] font-semibold tracking-[-0.03em] text-white">
        {title}
      </h1>
      {subtitle ? <div>{subtitle}</div> : null}
    </div>
  );
}

export function MetricLegend({
  items,
}: {
  items: Array<{ label: string; value: string; color: string }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-10 text-[16px] font-medium text-[#eef3ff]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span
            className="h-[11px] w-[11px] rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span>
            {item.label} {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PageDivider() {
  return <div className="h-px w-full bg-[#2a4d89]/80" />;
}

export function SearchBar({
  placeholder,
  className,
  value,
  onChange,
}: {
  placeholder: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label
      className={cx(
        'flex h-[54px] w-full items-center gap-4 rounded-[16px] bg-[#2b4b87]/60 px-4 text-[#dfe7fb] shadow-[0_18px_40px_rgba(6,12,28,0.18)] backdrop-blur-[18px]',
        className
      )}
    >
      <input
        aria-label={placeholder}
        className="w-full bg-transparent text-[17px] font-medium placeholder:text-[#bfcce6] focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
      <Search className="h-6 w-6 shrink-0 text-[#d6dff2]" strokeWidth={2.1} />
    </label>
  );
}

export function FilterChip({
  label,
  prefix,
  className,
}: {
  label: string;
  prefix?: string;
  className?: string;
}) {
  return (
    <div className={cx('flex items-center gap-3 text-[#d1d7e7]', className)}>
      {prefix ? (
        <span className="text-[16px] font-medium text-[#dce2ee]">{prefix}</span>
      ) : null}
      <button
        type="button"
        className="flex h-[50px] items-center gap-3 rounded-[14px] bg-[#1d386a]/82 px-4 text-[16px] font-medium text-[#e9eef9] shadow-[0_16px_32px_rgba(6,12,29,0.18)]"
      >
        <span>{label}</span>
        <ChevronDown className="h-5 w-5" strokeWidth={2.2} />
      </button>
    </div>
  );
}

export function TabsRow({
  items,
  activeIndex = 0,
  activeItem,
  onChange,
}: {
  items: string[];
  activeIndex?: number;
  activeItem?: string;
  onChange?: (item: string, index: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-7 text-[16px] font-medium text-[#e4eaf8]">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange?.(item, index)}
          className={cx(
            'rounded-[12px] px-4 py-3 transition',
            activeItem
              ? activeItem === item
                ? 'bg-[#23478a] text-white shadow-[0_16px_28px_rgba(7,21,48,0.3)]'
                : 'text-[#e4eaf8]'
              : index === activeIndex
                ? 'bg-[#23478a] text-white shadow-[0_16px_28px_rgba(7,21,48,0.3)]'
                : 'text-[#e4eaf8]'
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'rounded-[16px] border border-white/5 bg-[linear-gradient(180deg,rgba(26,44,80,0.94)_0%,rgba(19,34,62,0.92)_100%)] shadow-[0_28px_60px_rgba(4,10,24,0.22)] backdrop-blur-[18px]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'flex h-[42px] items-center rounded-t-[16px] bg-[#23478a] px-5 text-[16px] font-semibold text-[#eef3ff]',
        className
      )}
    >
      {title}
    </div>
  );
}

export function StatusPill({
  label,
  tone,
  className,
  compact = false,
}: {
  label: string;
  tone: FlowTone;
  className?: string;
  compact?: boolean;
}) {
  const isTextOnly = tone === 'warning' || tone === 'success';

  return (
    <span
      className={cx(
        'inline-flex items-center rounded-[16px] px-4 font-semibold',
        compact ? 'h-[34px] text-[15px]' : 'h-[40px] text-[15px]',
        isTextOnly ? 'bg-transparent px-0' : '',
        toneStyles[tone],
        className
      )}
    >
      {label}
    </span>
  );
}

export function StatusDotLabel({
  label,
  tone,
}: {
  label: string;
  tone: 'success' | 'warning' | 'neutral';
}) {
  const dotClassName =
    tone === 'success'
      ? 'bg-[#24cd35]'
      : tone === 'warning'
        ? 'bg-[#c5c019]'
        : 'bg-[#1f2024]';

  return (
    <div className="flex items-center gap-3">
      <span className={cx('h-[11px] w-[11px] rounded-full', dotClassName)} />
      <span className="text-[16px] font-medium text-[#eef3ff]">{label}</span>
    </div>
  );
}

export function AvatarCluster({
  avatars,
  className,
}: {
  avatars: string[];
  className?: string;
}) {
  return (
    <div className={cx('flex items-center', className)}>
      {avatars.map((avatar, index) => (
        <img
          key={`${avatar}-${index}`}
          src={avatar}
          alt=""
          className={cx(
            'h-9 w-9 rounded-full border-2 border-[#1b315f] object-cover',
            index === 0 ? '' : '-ml-2.5'
          )}
        />
      ))}
    </div>
  );
}

export function ProgressTrack({
  value,
  label,
  trailing,
  className,
}: {
  value: number;
  label: string;
  trailing?: string;
  className?: string;
}) {
  return (
    <div className={cx('flex items-center gap-4', className)}>
      <div className="relative h-[36px] flex-1 overflow-hidden rounded-[10px] bg-[#182944]">
        <div
          className="absolute inset-y-0 left-0 rounded-[10px] bg-[#164b21]"
          style={{ width: `${value}%` }}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-[#24c93a]">
          {label}
        </span>
      </div>
      {trailing ? (
        <span className="text-[16px] font-medium text-[#96a9d6]">{trailing}</span>
      ) : null}
    </div>
  );
}

export function KebabButton() {
  return (
    <button
      type="button"
      aria-label="Open actions"
      className="flex h-8 w-8 items-center justify-center rounded-full text-[#eef2fb]"
    >
      <MoreHorizontal className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
}

export function MenuList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cx(
        'absolute right-0 top-full z-20 mt-3 min-w-[150px] rounded-[16px] bg-[#050607] py-3 shadow-[0_24px_40px_rgba(0,0,0,0.42)]',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className="block w-full px-4 py-3 text-left text-[15px] text-white/65 transition hover:bg-white/5 hover:text-white"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function DetailsMenu({
  trigger,
  children,
  className,
}: {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cx('group relative', className)}>
      <summary className="cursor-pointer">{trigger}</summary>
      {children}
    </details>
  );
}

export function StatusText({
  value,
}: {
  value: string;
}) {
  const className =
    value === 'Generating...' ||
    value === 'Awaiting Signatures' ||
    value === 'Partially Signed'
      ? 'text-[#cbd2df]'
      : value === 'Failed'
        ? 'text-[#cbd2df]'
        : value === 'Canceled'
          ? 'text-[#cbd2df]'
          : value === 'Generated'
            ? 'text-[#dce5f8]'
            : 'text-[#8fa3cf]';

  return <span className={cx('text-[16px] font-medium', className)}>{value}</span>;
}
