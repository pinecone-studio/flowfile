import { DocumentPanel } from "../../features/documents/components/DocumentPanel";


export default function DocumentsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 italic tracking-tight">DOCUMENTS</h1>
        <p className="text-gray-500">Manage and track all employee documents.</p>
      </div>
      
      <DocumentPanel />
    </div>
  );
}