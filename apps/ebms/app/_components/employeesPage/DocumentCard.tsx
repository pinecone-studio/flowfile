
type DocumentCardProps = {
  title: string;
  type: string;
  expanded: boolean;
  onToggle: () => void;
  generated?: string;
  storage?: string;
};

const DocumentCard = ({
  title,
  type,
  expanded,
  onToggle,
  generated,
  storage,
}: DocumentCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 3v5h5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6M9 17h4"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-medium leading-5 text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-400">{type}</p>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`mt-1 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-500 ease-out ${
            expanded ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? 'mt-4 max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className={`border-t border-slate-200 pt-4 transition-all duration-500 ease-in-out ${
            expanded ? 'translate-y-0' : '-translate-y-2'
          }`}
        >
          <div className="grid grid-cols-2 gap-y-3 text-xs">
            <div>
              <p className="text-slate-400">Generated:</p>
              <p className="mt-1 text-slate-700">{generated}</p>
            </div>

            <div className="text-right">
              <p className="text-slate-400">Storage:</p>
              <p className="mt-1 text-slate-700">{storage}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition-colors duration-300 hover:bg-slate-50"
            >
              Print
            </button>

            <button
              type="button"
              className="rounded-md bg-slate-600 px-4 py-2 text-sm text-white transition-colors duration-300 hover:bg-slate-700"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
