const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const pad = (n) => String(n).padStart(2, "0");

/** Today as YYYY-MM-DD in the user's local time zone. */
export const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Parses a YYYY-MM-DD string as local midnight (no UTC shift). */
export const parseDateOnly = (value) => {
  if (typeof value !== "string" || !DATE_ONLY.test(value)) return null;

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Normalizes any date-like value to YYYY-MM-DD, or "" if invalid. */
export const normalizeDateOnly = (value) => {
  if (!value) return "";
  if (typeof value === "string" && DATE_ONLY.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatDate = (value) => {
  const date = parseDateOnly(value);
  return date ? date.toLocaleDateString() : "";
};

export const formatDisplayDate = (value) => {
  const date = parseDateOnly(value);
  if (!date) return "";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/** Whole days from today (local) to the given date. Negative = in the past. */
export const daysFromToday = (value) => {
  const date = parseDateOnly(value);
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round((date.getTime() - today.getTime()) / 86400000);
};
