import { documentPipelineRows } from './documentPipeline.data';
import { DocumentPipelineRow } from './DocumentPipelineRow';

const documentGridClassName =
  'grid-cols-[1.38fr_1.26fr_0.9fr_1.12fr_1fr_1.05fr_1.22fr_0.74fr]';

const headers = [
  'Document Name',
  'Employee',
  'Action',
  'Generated Date',
  'Lifecycle',
  'Signed By',
  'Pending',
  'Status',
];

export function DocumentPipelineTable() {
  return (
    <div className="mt-[18px] flex-1 border-t border-[#e5e9f0] pt-[16px]">
      <div
        className={`grid ${documentGridClassName} gap-x-[28px] rounded-[4px] bg-[#f3f5f8] px-[10px] py-[9px] text-[15px] font-normal leading-none text-[#4b5563]`}
      >
        {headers.map((header) => (
          <span key={header} className={header === 'Status' ? 'text-right' : ''}>
            {header}
          </span>
        ))}
      </div>

      <div className="pt-[10px]">
        {documentPipelineRows.map((row) => (
          <DocumentPipelineRow
            key={row.id}
            row={row}
            gridClassName={documentGridClassName}
          />
        ))}
      </div>
    </div>
  );
}
