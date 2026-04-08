export default function ErrorState({
  title = "Something went wrong",
  message = "We could not load your tasks.",
  onRetry,
  isRetrying = false,
}) {
  return (
    <div className="rounded-[1.5rem] border border-red-200 bg-red-50/80 p-4 shadow-sm backdrop-blur sm:rounded-3xl sm:p-6 dark:border-red-500/20 dark:bg-red-500/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-base text-red-600 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl dark:bg-red-500/10 dark:text-red-300">
            !
          </div>

          <h3 className="text-base font-bold text-red-700 sm:text-lg dark:text-red-300">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-red-600/90 dark:text-red-200/90">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="w-full cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:rounded-2xl dark:bg-red-600"
        >
          {isRetrying ? "Retrying..." : "Retry"}
        </button>
      </div>
    </div>
  );
}
