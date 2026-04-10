export default function TodoListSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-3 dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-1 h-4 w-4 shrink-0 rounded-full bg-zinc-200 dark:bg-slate-700" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="h-4 w-28 rounded-full bg-zinc-200 sm:w-36 dark:bg-slate-700" />
                <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-slate-700" />
                <div className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-slate-700" />
              </div>

              <div className="mt-2.5 space-y-1.5">
                <div className="h-3.5 w-full rounded-full bg-zinc-200 dark:bg-slate-700" />
                <div className="h-3.5 w-11/12 rounded-full bg-zinc-200 dark:bg-slate-700" />
                <div className="h-3.5 w-8/12 rounded-full bg-zinc-200 dark:bg-slate-700" />
              </div>

              <div className="mt-2.5 h-5 w-24 rounded-full bg-zinc-200 sm:w-28 dark:bg-slate-700" />

              <div className="mt-2.5 flex gap-1.5 sm:hidden">
                <div className="h-8 flex-1 rounded-lg bg-zinc-200 dark:bg-slate-700" />
                <div className="h-8 flex-1 rounded-lg bg-zinc-200 dark:bg-slate-700" />
              </div>
            </div>

            <div className="hidden gap-1.5 sm:flex">
              <div className="h-8 w-14 rounded-lg bg-zinc-200 dark:bg-slate-700" />
              <div className="h-8 w-14 rounded-lg bg-zinc-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
