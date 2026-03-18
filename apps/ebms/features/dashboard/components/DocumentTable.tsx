

export type Document = {
    id: string;
    documentName: string;
    employeeName: string;
    employeeCode: string;
    action: string;
    generatedAt: string;
    status: 'complete' | 'failed' | 'pending' | 'processing';
};

export const StatusStyles: Record<Document['status'], string> = {
  pending: 'bg-[#e8f4dd] text-[#6f8f4e]',
  failed: 'bg-[#f5dfda] text-[#b46358]',
  complete: 'bg-[#dff3e0] text-[#2f8a3f]',
  processing: 'bg-[#d7eff7] text-[#2b9ab8]',
};

const documents: Document[] = [
        {
            id: "1",
            documentName: "Хөдөлмөрийн гэрээ",
            employeeName: "Бат-Эрдэнэ Дорж",
            employeeCode: "EMP-0042",
            action: "add_employee",
            generatedAt: "2026-03-18T10:30:00Z",
            status: "complete"
        },
        {
            id: "2",
            documentName: "Туршилтаар авах тушаал",
            employeeName: "Сүхбат Баяр",
            employeeCode: "EMP-0123",
            action: "add_employee",
            generatedAt: "2026-03-17T14:20:00Z",
            status: "failed"
        }, ]
  

export const DocumentTable = () => {

    return (<div className="overflow-y-auto mt-[16px] flex-1 border-t border-[#e5e9f0]">
        <div className="grid grid-cols-[1.5fr_1.3fr_0.8fr_0.9fr_0.9fr] gap-4 mt-4 items-center rounded-[4px] bg-[#f3f5f8] px-[12px] py-[10px] text-[15px] text-[#4b5563]">
            <span>Document name</span>
            <span>Employee</span>
            <span>Action</span>
            <span>Generated At</span>
            <span>Status</span>
        </div>
            <div className="divide-y divide-gray-200">
                {documents.map((doc) => (
                    <div 
                        key={doc.id}
                        className="grid grid-cols-[1.5fr_1.3fr_0.8fr_0.9fr_0.9fr] gap-4 items-center border-b border-[#edf0f5] px-[12px] py-[10px] text-[15px] text-[#1f2937] last:border-b-0"
                    >
                        <span className="truncate">{doc.documentName}</span>
                        <div>
                            <div className="truncate">{doc.employeeName}</div>
                            <div className="text-sm text-gray-500">{doc.employeeCode}</div>
                        </div>
                        <span className="text-blue-600 font-medium">{doc.action}</span>
                        <span className="truncate">
                            {new Date(doc.generatedAt).toLocaleDateString('mn-MN')}
                        </span>
                        <span className={`inline-flex w-full items-center justify-center rounded-full px-[14px] py-[4px] text-[14px] font-medium ${StatusStyles[doc.status]}`}>
                            {doc.status}
                        </span>
                    </div>
                ))}
                </div>
            </div>
)}

