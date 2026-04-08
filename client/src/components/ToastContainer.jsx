import { useEffect } from "react";

export default function ToastContainer({ notifications, dismissNotification }) {
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) =>
      setTimeout(() => {
        dismissNotification(notification.id);
      }, 3200),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, dismissNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[60] flex flex-col gap-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm">
      {notifications.slice(0, 4).map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur transition-all duration-300 ${
            notification.type === "error"
              ? "border-red-200 bg-red-500 text-white dark:border-red-500/30 dark:bg-red-500"
              : "border-indigo-200 bg-indigo-600 text-white dark:border-indigo-500/30 dark:bg-indigo-600"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-base">
              {notification.type === "error" ? "✕" : "✓"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-semibold">
                {notification.message}
              </p>
              <p className="mt-1 text-xs text-white/80">
                {notification.createdAt}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(notification.id)}
              className="cursor-pointer text-sm text-white/80 transition hover:text-white"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
