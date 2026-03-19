import { Suspense } from 'react';
import SignPage from '../../features/e-sign/Signature';

function page() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading sign page...</div>}>
      <div>
        <SignPage />
      </div>
    </Suspense>
  );
}

export default page;
