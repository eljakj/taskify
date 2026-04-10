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
    <div className="pointer-events-none fixed inset-x-3 bottom-2.5 z-60 flex flex-col gap-2.5 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-full sm:max-w-sm">
      {notifications.slice(0, 4).map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto rounded-xl border px-3.5 py-2.5 shadow-xl transition-all duration-300 ${
            notification.type === "error"
              ? "border-red-700 bg-red-700 text-white dark:border-red-700 dark:bg-red-700"
              : "border-green-700 bg-green-700 text-white dark:border-green-700 dark:bg-green-700"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 text-sm">
              {notification.type === "error" ? "✕" : "✓"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="wrap-break-words text-body font-semibold">
                {notification.message}
              </p>
              <p className="mt-0.5 text-xs text-white/80">
                {notification.createdAt}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(notification.id)}
              className="cursor-pointer text-sm text-white/80 hover:text-white"
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
