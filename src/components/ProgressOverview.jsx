export default function ProgressOverview({
  total,
  completed,
  active,
  overdue,
}) {
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-3.5 sm:mb-5 sm:rounded-2xl sm:p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="grid gap-2.5 sm:gap-3 lg:grid-cols-[1fr_auto] lg:items-center lg:justify-between">
        <div>
          <p className="text-muted font-medium uppercase">Progress</p>

          <h2 className="mt-1.5 text-section-title font-black text-zinc-800 dark:text-zinc-100">
            {completed} of {total} tasks completed
          </h2>

          <p className="mt-1 text-muted">
            {active} active · {overdue} overdue
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-indigo-200 bg-indigo-200 px-3 py-2 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300">
          <span className="text-lg font-black">{progress}%</span>
          <span className="text-xs font-medium">done</span>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 sm:mt-4 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
