import { useRef, useState } from "react";

const priorities = [
  {
    value: "low",
    label: "Low",
    dot: "bg-emerald-400",
    active:
      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300",
    idle: "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80",
  },
  {
    value: "medium",
    label: "Medium",
    dot: "bg-amber-400",
    active:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300",
    idle: "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80",
  },
  {
    value: "high",
    label: "High",
    dot: "bg-red-400",
    active:
      "border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300",
    idle: "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80",
  },
];

function getLocalDate() {
  return new Date().toLocaleDateString("en-CA");
}

export default function TodoForm({ addTodo, isAdding }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(getLocalDate());
  const dueDateRef = useRef(null);

  const openDatePicker = () => {
    if (dueDateRef.current?.showPicker) {
      dueDateRef.current.showPicker();
    } else {
      dueDateRef.current?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isAdding) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

    const success = await addTodo({
      title: trimmedTitle,
      description: trimmedDescription,
      priority,
      dueDate,
    });

    if (success) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(getLocalDate());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        disabled={isAdding}
        className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-indigo-600 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add description..."
        rows={4}
        disabled={isAdding}
        className="w-full resize-none rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-indigo-600 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
      />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white/85 p-3 shadow-sm sm:rounded-2xl sm:p-4 dark:border-slate-700 dark:bg-slate-900/90">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-slate-400">
            Priority
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {priorities.map((item) => {
              const active = priority === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPriority(item.value)}
                  disabled={isAdding}
                  className={`flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-full ${
                    active ? item.active : item.idle
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/85 p-3 shadow-sm sm:rounded-2xl sm:p-4 dark:border-slate-700 dark:bg-slate-900/90">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-slate-400">
            Due date
          </p>

          <div
            className="relative"
            onClick={!isAdding ? openDatePicker : undefined}
          >
            <input
              ref={dueDateRef}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onFocus={!isAdding ? openDatePicker : undefined}
              disabled={isAdding}
              className="min-h-[44px] w-auto cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-800 outline-none transition [color-scheme:light] focus:border-indigo-600 sm:rounded-2xl sm:px-4 sm:text-base dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] dark:focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isAdding}
        className="w-full cursor-pointer rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-2xl sm:py-4 sm:text-base dark:bg-indigo-600"
      >
        {isAdding ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}
