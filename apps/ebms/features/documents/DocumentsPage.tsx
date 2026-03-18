import { DocumentPipelineTable } from './components/DocumentPipelineTable';

export default function DocumentsPage() {
  return (
    <section className="min-h-full bg-[#f7f8fb] px-[28px] py-[28px] md:px-[34px] md:py-[30px]">
      <div className="mx-auto max-w-[1548px]">
        <section className="flex min-h-[calc(100vh-60px)] flex-col rounded-[24px] border border-[#d8dfe9] bg-white px-[30px] py-[30px] shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-[#4b5563]">
            Document Pipeline
          </h1>
          <DocumentPipelineTable />
        </section>
      </div>
    </section>
  );
}
