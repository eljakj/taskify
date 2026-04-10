export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md hover:-translate-y-0.5 hover:bg-zinc-100 active:scale-[0.96] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {isDark ? (
        // 🌙 Moon (dark mode)
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5 14.5C19.3 15.1 17.95 15.44 16.5 15.44C11.81 15.44 8 11.63 8 6.94C8 5.49 8.34 4.14 8.94 2.94C5.43 4.16 3 7.49 3 11.38C3 16.3 6.98 20.28 11.9 20.28C15.79 20.28 19.12 17.85 20.5 14.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // ☀️ Sun (light mode)
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
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
      )}
    </button>
  );
}
