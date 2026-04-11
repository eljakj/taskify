import Logo from "@/components/Logo";

function StatusIcon({ status }) {
  if (status === "success") {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 animate-[statusPop_260ms_ease-out]">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path
            d="M6 12.5L10 16.5L18 8.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-300 animate-[statusPop_260ms_ease-out]">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path
            d="M8 8L16 16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M16 8L8 16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03]" />
      <div className="absolute inset-[6px] animate-spin rounded-full border-[2.5px] border-transparent border-t-indigo-400 border-r-violet-400" />
    </div>
  );
}

export default function FullScreenLoader({
  title = "Checking authentication",
  message = "Please wait while we prepare your workspace.",
  status = "loading", // loading | success | error
}) {
  const statusTextClass =
    status === "success"
      ? "text-emerald-300 border-emerald-400/20 bg-emerald-500/10"
      : status === "error"
        ? "text-red-300 border-red-400/20 bg-red-500/10"
        : "text-indigo-300 border-indigo-400/20 bg-indigo-500/10";

  const badgeText =
    status === "success"
      ? "Authenticated"
      : status === "error"
        ? "Authentication failed"
        : "Secure session";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-[-5rem] top-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute left-[-5rem] bottom-[-4rem] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-5xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl animate-[loaderCardIn_420ms_cubic-bezier(0.22,1,0.36,1)] sm:p-9">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5">
              <Logo />
            </div>

            <div
              className={`mb-5 inline-flex rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${statusTextClass}`}
            >
              {badgeText}
            </div>

            <h2 className="text-[1.75rem] font-semibold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              {message}
            </p>

            <div className="mt-8">
              <StatusIcon status={status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
