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
    <section className="overflow-hidden rounded-[26px] border border-white/5 bg-[linear-gradient(180deg,rgba(26,42,71,0.88)_0%,rgba(19,30,49,0.92)_100%)] shadow-[0_26px_72px_rgba(4,9,22,0.26)]">
      <div className="bg-[linear-gradient(90deg,rgba(53,86,145,0.95)_0%,rgba(45,80,143,0.72)_100%)] px-8 py-4">
        <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#eef3ff]">
          {title}
        </h2>
      </div>

      <div className={`px-8 py-7 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
