import { Suspense } from 'react';
import AuditLogPage from '../../features/audit/AuditLogPage';

export default function AuditLog() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading audit log...</div>}>
      <AuditLogPage />
    </Suspense>
  );
}
