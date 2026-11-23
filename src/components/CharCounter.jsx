export default function CharCounter({ length, max }) {
  // Show the counter only when the user gets close to the limit.
  if (length < max * 0.8) return null;

  const isAtLimit = length >= max;

  return (
    <p
      aria-live="polite"
      className={`text-right text-xs ${
        isAtLimit
          ? "text-red-600 dark:text-red-400"
          : "text-amber-600 dark:text-amber-400"
      }`}
    >
      {length} / {max}
      {isAtLimit && " · Maximum reached"}
    </p>
  );
}
