import Logo from "@/components/Logo";

export default function FullScreenLoader({
  message = "Checking authentication...",
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.22),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:text-white" /* stylelint-disable-line */>
      <div className="animate-[fadeIn_220ms_ease-out]">
        <Logo />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />

        <p className="text-sm font-medium text-zinc-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}
