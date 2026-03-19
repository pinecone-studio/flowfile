import type { DetailField } from './employeeProfile.data';

type DetailInfoCardProps = {
  title: string;
  fields: DetailField[];
};

export function DetailInfoCard({ title, fields }: DetailInfoCardProps) {
  const gridClassName =
    fields.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <section className="rounded-[20px] border border-white/5 bg-[linear-gradient(180deg,rgba(39,54,79,0.95)_0%,rgba(37,51,76,0.98)_100%)] px-[22px] py-[18px] shadow-[0_18px_48px_rgba(4,9,22,0.18)]">
      <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#f5f8ff]">
        {title}
      </h2>

      <div className={`mt-6 grid gap-x-[68px] gap-y-8 ${gridClassName}`}>
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-[18px] font-medium text-[#7f92ba]">{field.label}</p>
            <p className="mt-2 text-[19px] font-semibold tracking-[-0.02em] text-[#f3f7ff]">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
