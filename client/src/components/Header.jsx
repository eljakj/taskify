import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

function LogoMark() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 shadow-lg shadow-indigo-500/25 sm:h-11 sm:w-11">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 text-white sm:h-5.5 sm:w-5.5"
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
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white/85 text-sm font-bold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200 dark:hover:bg-slate-900"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[min(15rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
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
    <header className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
      <div className="flex min-w-0 items-center gap-3">
        <LogoMark />
        <h1 className="truncate text-xl font-black tracking-tight text-zinc-950 sm:text-2xl dark:text-white">
          Taskify
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
