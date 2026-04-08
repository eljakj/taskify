export default function TodoListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-zinc-200 bg-white/70 p-3 shadow-sm backdrop-blur sm:rounded-3xl sm:p-4 dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-zinc-200 dark:bg-slate-700" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-5 w-32 rounded-full bg-zinc-200 sm:w-40 dark:bg-slate-700" />
                <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-slate-700" />
                <div className="h-6 w-24 rounded-full bg-zinc-200 dark:bg-slate-700" />
              </div>

              <div className="mt-3 space-y-2">
                <div className="h-4 w-full rounded-full bg-zinc-200 dark:bg-slate-700" />
                <div className="h-4 w-11/12 rounded-full bg-zinc-200 dark:bg-slate-700" />
                <div className="h-4 w-8/12 rounded-full bg-zinc-200 dark:bg-slate-700" />
              </div>

              <div className="mt-3 h-6 w-28 rounded-full bg-zinc-200 sm:w-32 dark:bg-slate-700" />

              <div className="mt-3 flex gap-2 sm:hidden">
                <div className="h-9 flex-1 rounded-xl bg-zinc-200 dark:bg-slate-700" />
                <div className="h-9 flex-1 rounded-xl bg-zinc-200 dark:bg-slate-700" />
              </div>
            </div>

            <div className="hidden gap-2 sm:flex">
              <div className="h-9 w-16 rounded-xl bg-zinc-200 dark:bg-slate-700" />
              <div className="h-9 w-16 rounded-xl bg-zinc-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
