export default function StatsBar({ total, active, completed, overdue }) {
  const cards = [
    {
      label: "Total",
      value: total,
      className:
        "border-indigo-200 bg-indigo-200 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300",
      
    },
    {
      label: "Active",
      value: active,
      className: "border-sky-200 bg-sky-200 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-300",
      
    },
    {
      label: "Completed",
      value: completed,
      className: "border-emerald-200 bg-emerald-200 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300",
    
    },
    {
      label: "Overdue",
      value: overdue,
      className: "border-red-200 bg-red-200 text-red-700 dark:border-red-500/20 dark:bg-red-500/20 dark:text-red-300",

    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-2.5 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-2.5 hover:-translate-y-0.5  active:scale-[0.98] sm:rounded-2xl sm:p-3 ${card.className}`}
        >
          <p className="text-[10px] font-semibold uppercase sm:text-[11px]">
            {card.label}
          </p>

          <p className="mt-1.5 text-lg font-black sm:mt-2 sm:text-xl">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
