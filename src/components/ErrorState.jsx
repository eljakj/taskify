export default function ErrorState({
  title = "Something went wrong",
  message = "We could not load your tasks.",
  onRetry,
  isRetrying = false,
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 shadow-sm sm:rounded-2xl sm:p-4 dark:border-red-500/20 dark:bg-red-500/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300">
            !
          </div>

          <h3 className="text-card-title text-red-700 dark:text-red-300">
            {title}
          </h3>

          <p className="mt-1.5 text-body leading-6 text-red-600/90 dark:text-red-200/90">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="w-full cursor-pointer rounded-lg bg-red-500 px-4 py-2.5 text-body font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto dark:bg-red-600"
        >
          {isRetrying ? "Retrying..." : "Retry"}
        </button>
      </div>
    </div>
  );
}
