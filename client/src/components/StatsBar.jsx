export default function StatsBar({ total, active, completed, overdue }) {
  const cards = [
    {
      label: "Total",
      value: total,
      className:
        "border-zinc-200 bg-white/80 text-zinc-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white",
    },
    {
      label: "Active",
      value: active,
      className:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300",
    },
    {
      label: "Completed",
      value: completed,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      label: "Overdue",
      value: overdue,
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl border p-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] sm:rounded-3xl sm:p-4 ${card.className}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70 sm:text-xs">
            {card.label}
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight sm:mt-3 sm:text-3xl">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
