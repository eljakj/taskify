import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

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
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:-translate-y-0.5 hover:bg-zinc-100 active:scale-[0.96] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-[min(14rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-zinc-200 px-3 py-2.5 dark:border-slate-700">
            <p className="truncate text-body font-medium text-zinc-800 dark:text-white">
              {user.name}
            </p>
            <p className="mt-0.5 text-muted truncate">{user.email}</p>
          </div>

          <div className="p-1.5">
            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-body font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800"
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
    <header className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Logo />
      </div>

      <div className="flex shrink-0 items-center gap-2">
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
