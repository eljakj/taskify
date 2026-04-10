import { useRef, useState } from "react";
import CustomSelect from "@/components/CustomSelect";

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 3V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 3V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 9H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function getLocalDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TodoForm({ addTodo, isAdding }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(getLocalDate());
  const dueDateRef = useRef(null);

  const openDatePicker = () => {
    if (isAdding) return;
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
    <form onSubmit={handleSubmit} className="mb-5 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        disabled={isAdding}
        className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-body text-zinc-800 shadow-md outline-none hover:border-indigo-500 focus:border-indigo-500 sm:px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add description..."
        rows={10}
        disabled={isAdding}
        className="w-full resize-none rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-body text-zinc-800 shadow-md outline-none hover:border-indigo-500 focus:border-indigo-500 sm:px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-white "
      />

      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white/85 p-3 shadow-md dark:border-slate-700 dark:bg-slate-900/80">
          <p className="mb-2 text-muted font-semibold uppercase">
            Priority
          </p>

          <CustomSelect
            value={priority}
            onChange={setPriority}
            options={priorities}
            disabled={isAdding}
            placeholder="Select priority"
          />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/85 p-3 shadow-md dark:border-slate-700 dark:bg-slate-900/80">
          <p className="mb-2 text-muted font-semibold uppercase">
            Due date
          </p>

          <div className="relative">
            <button
              type="button"
              onClick={openDatePicker}
              disabled={isAdding}
              className="grid min-h-11 w-full cursor-pointer grid-cols-[1fr_auto] items-center rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-left text-body text-zinc-700  outline-none hover:border-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <span className={`truncate  ${dueDate ? "" : "text-muted"}`}>
                {dueDate ? formatDisplayDate(dueDate) : "Select date"}
              </span>

              <span className="ml-2 text-zinc-400 dark:text-slate-500">
                <CalendarIcon />
              </span>
            </button>

            <input
              ref={dueDateRef}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isAdding}
              className="pointer-events-none absolute inset-0 h-full w-full opacity-0 color-scheme dark:color-scheme"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isAdding}
        className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 text-body font-semibold text-white hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isAdding ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}
