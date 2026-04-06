export default function ProgressOverview({
  total,
  completed,
  active,
  overdue,
}) {
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-6 rounded-[1.5rem] border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:rounded-[2rem] sm:p-5 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_auto] lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-slate-400">
            Progress
          </p>

          <h2 className="mt-2 text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
            {completed} of {total} tasks completed
          </h2>

          <p className="mt-2 text-sm text-zinc-500 dark:text-slate-400">
            {active} active · {overdue} overdue
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-indigo-700 sm:rounded-2xl dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
          <span className="text-xl font-black sm:text-2xl">{progress}%</span>
          <span className="text-sm font-semibold">done</span>
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200 sm:mt-5 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
