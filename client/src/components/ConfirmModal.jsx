import { useEffect } from "react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false,
  isLoading = false,
}) {
  useEffect(() => {
    if (!isOpen || isLoading) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
      if (event.key === "Enter") onConfirm();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-4 sm:px-4"
      onClick={!isLoading ? onCancel : undefined}
    >
      <div
        className="w-full max-w-md animate-[modalIn_160ms_ease-out] rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xl sm:rounded-2xl sm:p-4 dark:border-slate-800 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-2.5">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
              isDanger
                ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-300"
                : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
            }`}
          >
            {isDanger ? "!" : "?"}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-card-title text-zinc-900 dark:text-white">
              {title}
            </h2>

            <p className="mt-1.5 text-body leading-6 text-zinc-500 dark:text-slate-400">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg border border-zinc-200 px-4 py-2.5 text-body font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-60 sm:w-auto dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full cursor-pointer rounded-lg px-4 py-2.5 text-body font-semibold text-white hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-70 sm:w-auto ${
              isDanger
                ? "bg-red-500 shadow-red-500/20 dark:bg-red-600"
                : "bg-indigo-600 shadow-indigo-600/20"
            }`}
          >
            {isLoading ? `${confirmText}...` : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
