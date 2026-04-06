import { useRef, useState } from "react";

const priorityStyles = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  high: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

const getDateStatus = (dateString, completed) => {
  if (!dateString || completed) return null;

  const today = new Date();
  const dueDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffInMs = dueDate.getTime() - today.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 0) {
    return {
      label: "Overdue",
      className:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
      isOverdue: true,
    };
  }

  if (diffInDays === 0) {
    return {
      label: "Today",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
      isOverdue: false,
    };
  }

  if (diffInDays === 1) {
    return {
      label: "Tomorrow",
      className:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300",
      isOverdue: false,
    };
  }

  return {
    label: formatDate(dateString),
    className:
      "border-zinc-200 bg-white/80 text-zinc-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300",
    isOverdue: false,
  };
};

function DragHandleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

export default function TodoItem({
  todo,
  toggleTodo,
  requestDeleteTodo,
  editTodo,
  isDragging,
  isDragOver,
  onDragStart,
  onDragEnd,
  isSaving = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(
    todo.description || "",
  );
  const [editedPriority, setEditedPriority] = useState(
    todo.priority || "medium",
  );
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate || "");
  const editedDateRef = useRef(null);

  const dueDateStatus = getDateStatus(todo.dueDate, todo.completed);

  const openEditedDatePicker = () => {
    if (editedDateRef.current?.showPicker) {
      editedDateRef.current.showPicker();
    } else {
      editedDateRef.current?.focus();
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedTitle = editedTitle.trim();
    const trimmedDescription = editedDescription.trim();

    if (!trimmedTitle) return;

    const success = await editTodo(todo.id, {
      title: trimmedTitle,
      description: trimmedDescription,
      priority: editedPriority,
      dueDate: editedDueDate,
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;

    setEditedTitle(todo.title);
    setEditedDescription(todo.description || "");
    setEditedPriority(todo.priority || "medium");
    setEditedDueDate(todo.dueDate || "");
    setIsEditing(false);
  };

  return (
    <div
      draggable={!isEditing && !isSaving}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`flex flex-col gap-4 rounded-2xl border p-3 shadow-sm backdrop-blur transition-all duration-200 sm:rounded-3xl sm:p-4 sm:flex-row sm:items-start sm:justify-between ${
        isDragging
          ? "scale-[0.98] opacity-50"
          : "hover:-translate-y-0.5 hover:shadow-md"
      } ${
        isDragOver
          ? "border-indigo-400 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-500/10"
          : dueDateStatus?.isOverdue
            ? "border-red-200 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/10"
            : "border-zinc-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <button
          type="button"
          className="mt-0.5 cursor-grab text-zinc-400 active:cursor-grabbing dark:text-slate-500"
          aria-label="Drag task"
          title="Drag task"
        >
          <DragHandleIcon />
        </button>

        <button
          type="button"
          onClick={() => toggleTodo(todo.id)}
          disabled={isSaving}
          className={`mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${
            todo.completed
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-zinc-300 bg-white hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
          }`}
          aria-label={
            todo.completed ? "Mark as incomplete" : "Mark as complete"
          }
          title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div
              className="space-y-3"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  handleCancel();
                }

                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  handleSave();
                }
              }}
            >
              <input
                type="text"
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-800 outline-none transition focus:border-indigo-600 focus:ring-0 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-0"
              />

              <textarea
                value={editedDescription}
                onChange={(event) => setEditedDescription(event.target.value)}
                rows={4}
                disabled={isSaving}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-800 outline-none transition focus:border-indigo-600 focus:ring-0 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-0"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={editedPriority}
                  onChange={(event) => setEditedPriority(event.target.value)}
                  disabled={isSaving}
                  className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-800 outline-none transition focus:border-indigo-600 focus:ring-0 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-0"
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>

                <div
                  className="cursor-pointer"
                  onClick={!isSaving ? openEditedDatePicker : undefined}
                >
                  <input
                    ref={editedDateRef}
                    type="date"
                    value={editedDueDate}
                    onChange={(event) => setEditedDueDate(event.target.value)}
                    onFocus={!isSaving ? openEditedDatePicker : undefined}
                    disabled={isSaving}
                    className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-800 outline-none transition [color-scheme:light] focus:border-indigo-600 focus:ring-0 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark] dark:focus:border-indigo-500 dark:focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full cursor-pointer rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto dark:bg-indigo-600"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full cursor-pointer rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`break-words whitespace-pre-wrap text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-100 ${
                    todo.completed ? "line-through opacity-50" : ""
                  }`}
                >
                  {todo.title}
                </h3>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                    priorityStyles[todo.priority || "medium"]
                  }`}
                >
                  {todo.priority || "medium"}
                </span>

                {dueDateStatus && (
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${dueDateStatus.className}`}
                  >
                    {dueDateStatus.label}
                  </span>
                )}
              </div>

              {todo.dueDate && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-slate-400">
                  <span className="rounded-full border border-zinc-200 bg-white/70 px-2.5 py-1 dark:border-slate-700 dark:bg-slate-800/70">
                    Due date: {formatDate(todo.dueDate)}
                  </span>
                </div>
              )}

              {todo.description && (
                <p className="mt-2 break-words whitespace-pre-wrap text-xs leading-6 text-zinc-500 sm:text-sm dark:text-slate-400">
                  {todo.description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="flex flex-wrap gap-2 sm:ml-4 sm:justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={isSaving}
            className="min-h-[42px] cursor-pointer rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => requestDeleteTodo(todo)}
            disabled={isSaving}
            className="min-h-[42px] cursor-pointer rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
