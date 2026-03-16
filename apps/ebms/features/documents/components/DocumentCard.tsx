// Document биш EmployeeDoc болгож өөрчилнө.
import { EmployeeDoc } from '../../../lib/documents/types/document.types';

interface Props {
  document: EmployeeDoc;
}

export const DocumentCard = ({ document }: Props) => {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm hover:border-blue-200 transition-colors">
      <div className="space-y-1">
        <div className="font-semibold text-gray-800">{document.title}</div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>{document.employeeName}</span>
          <span className="text-gray-300">|</span>
          <span className="text-xs">{document.createdAt}</span>
        </div>
      </div>

      <div className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize 
        ${document.status === 'completed' ? 'bg-green-100 text-green-700' : 
          document.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
          'bg-red-100 text-red-700'}`}
      >
        {document.status}
      </div>
    </div>
  );
};