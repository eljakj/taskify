export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative flex h-12 w-[112px] cursor-pointer items-center rounded-full border border-zinc-200 bg-white/85 px-2 shadow-sm transition hover:-translate-y-0.5 active:scale-[0.98] sm:h-14 sm:w-[124px] dark:border-slate-700 dark:bg-slate-900/85"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className={`absolute top-1 h-10 w-10 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/25 transition-all duration-300 sm:top-1.5 sm:h-11 sm:w-11 ${
          isDark ? "left-[62px] sm:left-[70px]" : "left-1"
        }`}
      />

      <span className="relative z-10 flex w-full items-center justify-between px-1">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${
            !isDark ? "text-white" : "text-zinc-400 dark:text-slate-500"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M12 2.75V5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M12 19V21.25"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M21.25 12H19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M5 12H2.75"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M18.54 5.46L16.95 7.05"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M7.05 16.95L5.46 18.54"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M18.54 18.54L16.95 16.95"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M7.05 7.05L5.46 5.46"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span
          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${
            isDark ? "text-white" : "text-zinc-400 dark:text-slate-500"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.5 14.5C19.3 15.1 17.95 15.44 16.5 15.44C11.81 15.44 8 11.63 8 6.94C8 5.49 8.34 4.14 8.94 2.94C5.43 4.16 3 7.49 3 11.38C3 16.3 6.98 20.28 11.9 20.28C15.79 20.28 19.12 17.85 20.5 14.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
