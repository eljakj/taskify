import { useEffect, useRef, useState } from "react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  const inputRef = useRef(null);
  const [localValue, setLocalValue] = useState(searchTerm);

  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(localValue);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [localValue, setSearchTerm]);

  return (
    <div className="mb-5">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-zinc-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(event) => setLocalValue(event.target.value)}
          placeholder="Search tasks, priority, date..."
          className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white/90 py-2.5 pl-10 pr-3.5 text-body text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
        />
      </div>
    </div>
  );
}
