import type { DetailField } from './employeeProfile.data';

type DetailInfoCardProps = {
  title: string;
  fields: DetailField[];
};

export function DetailInfoCard({ title, fields }: DetailInfoCardProps) {
  const gridClassName =
    fields.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <section className="rounded-[14px] border border-white/5 bg-[linear-gradient(180deg,rgba(8,15,29,0.98)_0%,rgba(8,14,27,0.98)_100%)] px-[22px] py-[19px] shadow-[0_22px_60px_rgba(4,9,22,0.2)]">
      <h2 className="text-[31px] font-semibold tracking-[-0.03em] text-[#f5f8ff]">
        {title}
      </h2>

      <div className={`mt-[17px] grid gap-x-[68px] gap-y-[26px] ${gridClassName}`}>
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-[18px] font-medium text-[#788bb5]">{field.label}</p>
            <p className="mt-[7px] text-[19px] font-medium tracking-[-0.02em] text-[#f3f7ff]">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
