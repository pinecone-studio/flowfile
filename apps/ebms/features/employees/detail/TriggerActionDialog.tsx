'use client';

import { X } from 'lucide-react';
import type { TriggerActionDefinition } from './employeeDetail.transform';

type TriggerActionDialogProps = {
  action: TriggerActionDefinition | null;
  values: Record<string, string>;
  isSubmitting: boolean;
  onChange: (fieldName: string, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function getFieldLabel(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (value) => value.toUpperCase());
}

function getFieldType(fieldName: string) {
  if (/^is[A-Z]/.test(fieldName)) {
    return 'boolean';
  }

  return /date/i.test(fieldName) ? 'date' : /days|number/i.test(fieldName) ? 'number' : 'text';
}

export function TriggerActionDialog({
  action,
  values,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: TriggerActionDialogProps) {
  if (!action) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020713]/78 px-4 backdrop-blur-[10px]">
      <div className="w-full max-w-[560px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,28,49,0.98)_0%,rgba(8,15,29,0.98)_100%)] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[16px] font-medium uppercase tracking-[0.18em] text-[#6f86b4]">
              Trigger Action
            </p>
            <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-white">
              {action.label}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close trigger action dialog"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/5 text-[#ebf1ff] transition hover:bg-white/10"
          >
            <X className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>

        <div className="mt-7 space-y-4">
          {action.fields.length > 0 ? action.fields.map((fieldName) => {
            const fieldType = getFieldType(fieldName);

            return (
              <label key={fieldName} className="block">
                <span className="mb-2 block text-[15px] font-medium text-[#93a7d1]">
                  {getFieldLabel(fieldName)}
                </span>
                {fieldType === 'boolean' ? (
                  <select
                    value={values[fieldName] ?? 'false'}
                    onChange={(event) => onChange(fieldName, event.target.value)}
                    className="h-[50px] w-full rounded-[14px] border border-[#294777] bg-[#10203b] px-4 text-[16px] text-white outline-none transition focus:border-[#4272c2]"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    type={fieldType}
                    value={values[fieldName] ?? ''}
                    onChange={(event) => onChange(fieldName, event.target.value)}
                    className="h-[50px] w-full rounded-[14px] border border-[#294777] bg-[#10203b] px-4 text-[16px] text-white outline-none transition focus:border-[#4272c2]"
                  />
                )}
              </label>
            );
          }) : (
            <p className="rounded-[16px] bg-[#10203b] px-4 py-4 text-[16px] text-[#dce7fb]">
              This action does not require any extra fields. Trigger it directly.
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[48px] rounded-[14px] border border-white/10 px-6 text-[16px] font-medium text-[#d7e1f5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-[48px] rounded-[14px] bg-[#2c5297] px-6 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Triggering...' : `Trigger ${action.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
