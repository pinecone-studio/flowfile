<<<<<<< HEAD

import DocumentsPage from '../../features/documents/DocumentsPage';

export default function Documents() {
  return <DocumentsPage />;
=======
import { DocumentPanel } from '../../features/documents/components/DocumentPanel';

export default function DocumentsPage() {
  return (
    <div className="w-full h-full p-8">
      <DocumentPanel />
    </div>
  );
>>>>>>> d828d3c (ui: hide scrollbar in DocumentPanel)
}
