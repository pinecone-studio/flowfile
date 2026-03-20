import type { ReactNode } from 'react';

type DetailPanelProps = {
  title: string;
  children: ReactNode;
  bodyClassName?: string;
};

export function DetailPanel({
  title,
  children,
  bodyClassName = '',
}: DetailPanelProps) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-white/5 bg-[linear-gradient(180deg,rgba(32,46,70,0.96)_0%,rgba(30,43,64,0.98)_100%)] shadow-[0_26px_72px_rgba(4,9,22,0.26)]">
      <div className="flex h-[42px] items-center bg-[#23478a] px-8">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#eef3ff]">
          {title}
        </h2>
      </div>

      <div className={`px-8 py-[22px] ${bodyClassName}`}>{children}</div>
    </section>
  );
}
