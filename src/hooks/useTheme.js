import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const getStoredTheme = () => {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function useTheme() {
  const [theme, setTheme] = useState(
    () => getStoredTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme = theme === "dark" ? "dark" : "light";

    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      if (getStoredTheme()) return;
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: theme still works, it is just not remembered.
    }
  };

  return { theme, toggleTheme };
}
