import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

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

function ProfileMenu({ user, onLogout, isLoggingOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white/85 text-sm font-bold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200 dark:hover:bg-slate-900"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 z-50 w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-slate-700">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {user.name}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="flex w-full cursor-pointer items-center justify-start rounded-xl px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header({
  theme,
  toggleTheme,
  user,
  onLogout,
  isLoggingOut,
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
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
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <ProfileMenu
          user={user}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </header>
  );
}
