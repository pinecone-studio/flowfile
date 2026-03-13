export function detectChangedFields(
  oldRecord: Record<string, unknown>,
  newValues: Record<string, unknown>,
): string[] {
  const changedFields: string[] = [];

  for (const [key, newValue] of Object.entries(newValues)) {
    const oldValue = oldRecord[key];

    const oldNormalized = oldValue ?? null;
    const newNormalized = newValue ?? null;

    if (oldNormalized !== newNormalized) {
      changedFields.push(key);
    }
  }

  return changedFields;
}
