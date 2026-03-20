export type ReviewResponse = {
  reviewRequest: {
    reviewerEmail: string;
    reviewerName: string | null;
    signerRole: string;
    signOrder: number;
    status: string;
    approvedAt: string | null;
    signatureImageUrl: string | null;
    signMethod: string | null;
  };
  job: {
    employeeId: string;
  } | null;
  document: {
    id: string;
    documentType: string;
    fileName: string;
    status: string;
    createdAt: string;
  } | null;
};

export type ApiEmployee = {
  firstName: string;
  lastName: string;
};
