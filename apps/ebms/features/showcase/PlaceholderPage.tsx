interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto w-full max-w-[1548px] pb-10">
      <h1 className="text-[36px] font-semibold tracking-[-0.03em] text-white md:text-[38px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[700px] text-[18px] leading-8 text-[#d2dcee]">
        {description}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-[28px] border border-[#26477e]/60 bg-[#122449]/72 p-8 shadow-[0_24px_60px_rgba(4,10,25,0.3)] backdrop-blur-[18px]">
          <p className="text-[16px] uppercase tracking-[0.22em] text-[#9db3db]">
            Flow Overview
          </p>
          <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.03em] text-white">
            This section is ready for data binding.
          </h2>
          <p className="mt-4 max-w-[660px] text-[17px] leading-8 text-[#d1dcee]">
            The new visual shell is applied here so the route stays consistent with
            the employees, documents, and actions views. Hook your real data into
            this panel when the backend contract is finalized.
          </p>
        </section>

        <section className="rounded-[28px] border border-[#26477e]/60 bg-[#162a53]/72 p-8 shadow-[0_24px_60px_rgba(4,10,25,0.3)] backdrop-blur-[18px]">
          <p className="text-[16px] uppercase tracking-[0.22em] text-[#9db3db]">
            Status
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[20px] bg-[#203a70]/72 px-5 py-4 text-[17px] text-[#e7eefc]">
              Background image and navigation shell are live.
            </div>
            <div className="rounded-[20px] bg-[#203a70]/72 px-5 py-4 text-[17px] text-[#e7eefc]">
              Surface styling matches the new dark blueprint.
            </div>
            <div className="rounded-[20px] bg-[#203a70]/72 px-5 py-4 text-[17px] text-[#e7eefc]">
              Replace these cards with route-specific content as needed.
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
