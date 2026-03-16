import { Document as AppDocument } from '@/apps/ebms/lib/documents/types/document.types';

interface Props {
  document: AppDocument; // Нэрийг нь өөрчилсөн
}

export const DocumentCard = ({ document }: Props) => {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm">
      <div className="space-y-1">
        <div className="font-semibold">{document.title}</div>
        <div className="text-sm text-gray-500">
          {document.employeeName} |{' '}
          <span className="text-xs">{document.createdAt}</span>
        </div>
      </div>
      <div className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-gray-100">
        {document.status}
      </div>
    </div>
  );
};
