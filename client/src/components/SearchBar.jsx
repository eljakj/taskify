import { useEffect, useRef } from "react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mb-6">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          🔎
        </span>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tasks, priority, date... (Press Shift + /)"
          className="w-full rounded-xl border border-zinc-200 bg-white/90 py-3 pl-11 pr-4 text-sm text-zinc-800 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-600 focus:ring-0 sm:rounded-full sm:py-4 sm:text-base dark:border-slate-700 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-0"
        />
      </div>
    </div>
  );
}
