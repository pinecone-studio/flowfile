import { documentStatusStyles } from './documentPipeline.data';
import type { DocumentPipelineRow as DocumentPipelineRowType } from './documentPipeline.types';

type DocumentPipelineRowProps = {
  row: DocumentPipelineRowType;
  gridClassName: string;
};

function renderLines(lines: string[], className = '') {
  return (
    <span className={`flex min-w-0 flex-col ${className}`.trim()}>
      {lines.map((line) => (
        <span key={line} className="truncate">
          {line}
        </span>
      ))}
    </span>
  );
}

export function DocumentPipelineRow({
  row,
  gridClassName,
}: DocumentPipelineRowProps) {
  return (
    <div
      className={`grid ${gridClassName} items-center gap-x-[28px] border-b border-[#edf0f5] px-[10px] py-[8px] text-[15px] leading-[1.42] text-[#1f2937]`}
    >
      <span className="truncate pr-[8px]">{row.documentName}</span>
      {renderLines(row.employee)}
      <span>{row.action}</span>
      {renderLines(row.generatedDate)}
      <span>{row.lifecycle}</span>
      {renderLines(row.signedBy)}
      {renderLines(row.pending)}
      <span className="flex justify-end">
        <span
          className={`inline-flex min-w-[93px] items-center justify-center rounded-full px-[13px] py-[4px] text-[14px] font-medium leading-none ${documentStatusStyles[row.status]}`}
        >
          {row.status}
        </span>
      </span>
    </div>
  );
}
