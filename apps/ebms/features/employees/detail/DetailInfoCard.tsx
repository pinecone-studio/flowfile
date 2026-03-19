import type { DetailField } from './employeeProfile.data';

type DetailInfoCardProps = {
  title: string;
  fields: DetailField[];
};

export function DetailInfoCard({ title, fields }: DetailInfoCardProps) {
  const gridClassName =
    fields.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <section className="rounded-[24px] border border-white/5 bg-[linear-gradient(180deg,rgba(53,78,121,0.62)_0%,rgba(35,51,80,0.82)_100%)] px-8 py-7 shadow-[0_18px_48px_rgba(4,9,22,0.18)]">
      <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#f5f8ff]">
        {title}
      </h2>

      <div className={`mt-6 grid gap-x-16 gap-y-8 ${gridClassName}`}>
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-[20px] font-medium text-[#7f92ba]">{field.label}</p>
            <p className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-[#f3f7ff]">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
