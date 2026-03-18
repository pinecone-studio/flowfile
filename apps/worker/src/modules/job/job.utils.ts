export function nowIso() {
  return new Date().toISOString();
}

export function buildStoragePath(
  jobId: string,
  generationOrder: number,
  fileName: string,
) {
  return `jobs/${jobId}/${String(generationOrder).padStart(2, '0')}-${fileName}`;
}
