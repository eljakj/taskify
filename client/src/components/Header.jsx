import ThemeToggle from "./ThemeToggle";
import NotificationCenter from "./NotificationCenter";

function LogoMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 shadow-lg shadow-indigo-500/25 sm:h-14 sm:w-14">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6 text-white sm:h-7 sm:w-7"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 6.5H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 12H13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 17.5H12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17.2 14.8L18.7 16.3L21.5 13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Header({
  theme,
  toggleTheme,
  notifications,
  dismissNotification,
  clearNotifications,
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <LogoMark />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
              Taskify
            </h1>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
              productivity
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">
            Clean planning. Fast actions. Better focus.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
        <NotificationCenter
          notifications={notifications}
          dismissNotification={dismissNotification}
          clearNotifications={clearNotifications}
        />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
}
