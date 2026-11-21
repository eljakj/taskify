export default function Logo({ size = "md", showText = true }) {
  const sizes = {
    sm: {
      box: "h-7 w-7",
      icon: "h-3 w-3",
      text: "text-base",
    },
    md: {
      box: "h-9 w-9",
      icon: "h-4 w-4",
      text: "text-page-title",
    },
    lg: {
      box: "h-11 w-11",
      icon: "h-5 w-5",
      text: "text-2xl",
    },
  };

  const current = sizes[size] || sizes.md;

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {/* Icon */}
      <div
        className={`group relative flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 via-violet-600 to-sky-500 shadow-indigo-500/25 ${current.box}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`${current.icon} text-white`}
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

      {/* Text */}
      {showText && (
        <h1
          className={`truncate font-black text-zinc-950 dark:text-white ${current.text}`}
        >
          Taskify
        </h1>
      )}
    </div>
  );
}
