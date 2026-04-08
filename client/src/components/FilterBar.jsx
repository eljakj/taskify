function SelectIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-zinc-400 dark:text-slate-500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FilterBar({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  allCompleted,
  toggleAllCompleted,
  hasTodos,
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      {/* SELECTS */}
      <div className="grid w-full gap-3 sm:grid-cols-2">
        {/* FILTER */}
        <div className="relative">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="min-h-[44px] w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white/85 px-4 py-3 pr-10 text-sm font-medium text-zinc-700 shadow-sm outline-none transition focus:border-indigo-600 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:focus:border-indigo-500"
          >
            <option value="all">All tasks</option>
            <option value="active">Active tasks</option>
            <option value="completed">Completed tasks</option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <SelectIcon />
          </span>
        </div>

        {/* SORT */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="min-h-[44px] w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white/85 px-4 py-3 pr-10 text-sm font-medium text-zinc-700 shadow-sm outline-none transition focus:border-indigo-600 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:focus:border-indigo-500"
          >
            <option value="manual">Manual order</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <SelectIcon />
          </span>
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="button"
        onClick={toggleAllCompleted}
        disabled={!hasTodos}
        className="w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:rounded-2xl dark:bg-indigo-600 dark:shadow-indigo-600/20"
      >
        {allCompleted ? "Deselect all" : "Select all"}
      </button>
    </div>
  );
}
