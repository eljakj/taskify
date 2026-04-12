import { useState } from "react";
import { loginUser } from "@/services/authApi";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import Logo from "@/components/Logo";

export default function LoginPage({ onLogin, onSwitchToRegister }) {
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh px-8 text-zinc-800 dark:text-white">
      <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-md rounded-xl border border-black/10  bg-white/75 p-5  sm:p-8 dark:border-white/10 dark:bg-slate-900/75">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-slate-700">
            <Logo showText={false} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-page-title">Welcome back</h1>
            <p className="mt-3 text-sm text-zinc-500 dark:text-slate-400">
              Sign in to continue managing your tasks
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-body outline-none hover:border-indigo-500 focus:border-indigo-500 sm:px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-body outline-none hover:border-indigo-500 focus:border-indigo-500 sm:px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            {error ? (
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:rounded-2xl dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-xl bg-indigo-600 py-3 text-body font-medium text-white hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="cursor-pointer font-medium text-indigo-600 hover:opacity-80 dark:text-indigo-300"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
