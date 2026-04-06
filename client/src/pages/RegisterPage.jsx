import { useState } from "react";
import { registerUser } from "../services/authApi";

export default function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
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
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onRegister(data.user);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 text-zinc-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.22),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-[1.5rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-colors duration-300 sm:rounded-[2rem] sm:p-8 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 text-center">
            <p className="mb-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              Taskify
            </p>
            <h1 className="text-2xl font-bold sm:text-4xl">Create account</h1>
            <p className="mt-3 text-sm text-zinc-500 dark:text-slate-400">
              Start organizing your tasks with a personal account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Jad"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:rounded-2xl sm:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="jad@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:rounded-2xl sm:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 sm:rounded-2xl sm:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:rounded-2xl dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:rounded-2xl sm:text-base dark:bg-white dark:text-black"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="cursor-pointer font-semibold text-indigo-600 transition hover:opacity-80 dark:text-indigo-300"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
