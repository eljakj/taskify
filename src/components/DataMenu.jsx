import { useRef } from "react";
import { exportTodos, importTodos } from "@/services/todoApi";

export default function DataMenu({ onImported, onError }) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      const blob = new Blob([exportTodos()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `taskify-backup-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      onError("Export failed");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const text = await file.text();
      const imported = await importTodos(text);
      onImported(imported);
    } catch (error) {
      console.error(error);
      onError(error.message || "Import failed");
    }
  };

  const buttonClass =
    "min-h-10 cursor-pointer rounded-lg border border-zinc-200 px-3 py-2 text-muted font-medium hover:bg-zinc-100 active:scale-[0.98] dark:border-slate-700 dark:hover:bg-slate-800";

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 text-muted">
      <span>Saved in this browser only.</span>

      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={handleExport} className={buttonClass}>
          Export
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={buttonClass}
        >
          Import
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Import tasks from a backup file"
        />
      </div>
    </div>
  );
}
