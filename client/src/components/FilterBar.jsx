

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
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid w-full gap-3 sm:grid-cols-2 lg:flex-1">
        <div className="relative">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="min-h-[44px] w-full cursor-pointer rounded-xl border border-zinc-200 bg-white/85 px-4 py-3 pr-10 text-sm font-medium text-zinc-700 shadow-sm outline-none transition focus:border-indigo-600 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:focus:border-indigo-500"
          >
            <option value="all">All tasks</option>
            <option value="active">Active tasks</option>
            <option value="completed">Completed tasks</option>
          </select>

          
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="min-h-[44px] w-full cursor-pointer rounded-xl border border-zinc-200 bg-white/85 px-4 py-3 pr-10 text-sm font-medium text-zinc-700 shadow-sm outline-none transition focus:border-indigo-600 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 dark:focus:border-indigo-500"
          >
            <option value="manual">Manual order</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
          </select>

        </div>
      </div>

      <button
        type="button"
        onClick={toggleAllCompleted}
        disabled={!hasTodos}
        className="min-h-[44px] w-full cursor-pointer whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:min-w-[140px] lg:rounded-2xl dark:bg-indigo-600 dark:shadow-indigo-600/20"
      >
        {allCompleted ? "Deselect all" : "Select all"}
      </button>
    </div>
  );
}
