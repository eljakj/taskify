import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const getStoredTheme = () => {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
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
    localStorage.setItem(STORAGE_KEY, resolvedTheme);
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
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
