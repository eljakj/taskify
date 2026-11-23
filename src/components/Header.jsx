import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function Header({ theme, mode, toggleTheme }) {
  return (
    <header className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Logo />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle theme={theme} mode={mode} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
}
