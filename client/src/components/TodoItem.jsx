import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CustomSelect from "@/components/CustomSelect";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

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

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
      "border-zinc-200 bg-white text-zinc-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300",
    isOverdue: false,
  };
};

function DragHandleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
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

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 3V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 3V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 9H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 20H8L18 10L14 6L4 16V20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M6 7H18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 11V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 11V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="7"
        width="12"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(
    todo.description || "",
  );
  const [editedPriority, setEditedPriority] = useState(
    todo.priority || "medium",
  );
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate || "");

  const editedDateRef = useRef(null);
  const menuRef = useRef(null);
  const actionButtonRef = useRef(null);

  const dueDateStatus = getDateStatus(todo.dueDate, todo.completed);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      const clickedInsideMenu = menuRef.current?.contains(event.target);
      const clickedInsideButton = actionButtonRef.current?.contains(
        event.target,
      );

      if (!clickedInsideMenu && !clickedInsideButton) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    if (!isMenuOpen || !actionButtonRef.current) return;

    const updatePosition = () => {
      const rect = actionButtonRef.current.getBoundingClientRect();
      const gap = 8;
      const menuWidth = 150;

      setMenuStyle({
        position: "fixed",
        top: rect.bottom + gap,
        left: Math.max(12, rect.right - menuWidth),
        width: menuWidth,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isMenuOpen]);

  const openEditedDatePicker = () => {
    if (isSaving) return;

    const input = editedDateRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
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
      className={`relative flex flex-col gap-3 overflow-visible rounded-xl border p-2.5 shadow-sm  transition-all duration-200 sm:flex-row sm:items-start sm:justify-between sm:rounded-2xl sm:p-3 ${
        isEditing ? "z-30" : "z-0"
      } ${
        isDragging
          ? "scale-[0.98] opacity-50"
          : "hover:-translate-y-0.5"
      } ${
        isDragOver
          ? "border-indigo-200 bg-indigo-200 dark:border-indigo-500/20 dark:bg-indigo-500/20"
          : dueDateStatus?.isOverdue
            ? "border-red-200 bg-red-200 dark:border-red-500/20 dark:bg-red-500/20"
            : todo.completed
              ? "border-emerald-200 bg-emerald-200 dark:border-emerald-500/20 dark:bg-emerald-500/20"
              : "border-sky-200 bg-sky-200 dark:border-sky-500/20 dark:bg-sky-500/20"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        <button
          type="button"
          className="mt-1 cursor-grab text-zinc-400 active:cursor-grabbing dark:text-slate-500"
          aria-label="Drag task"
          title="Drag task"
        >
          <DragHandleIcon />
        </button>

        <button
          type="button"
          onClick={() => toggleTodo(todo.id)}
          disabled={isSaving}
          className={`mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60 ${
            todo.completed
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-zinc-300 bg-white hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-indigo-500 dark:hover:bg-slate-700/80"
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
              className="h-3.5 w-3.5"
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
              className="space-y-2.5"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  handleCancel();
                }

                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            >
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-base text-zinc-800 outline-none hover:border-indigo-500 focus:border-indigo-500 sm:px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={10}
                disabled={isSaving}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-base text-zinc-800 outline-none hover:border-indigo-500 focus:border-indigo-500 sm:px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-white "
              />

              <div className="grid gap-2.5 sm:grid-cols-2">
                <CustomSelect
                  value={editedPriority}
                  onChange={setEditedPriority}
                  options={priorityOptions}
                  disabled={isSaving}
                  placeholder="Select priority"
                />

                <div className="relative">
                  <button
                    type="button"
                    onClick={openEditedDatePicker}
                    disabled={isSaving}
                    className="grid min-h-11 w-full cursor-pointer grid-cols-[1fr_auto] items-center rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-left text-body text-zinc-700  outline-none hover:border-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <span
                      className={`truncate ${
                        editedDueDate ? "" : "text-zinc-400 dark:text-slate-500"
                      }`}
                    >
                      {editedDueDate
                        ? formatDisplayDate(editedDueDate)
                        : "Select date"}
                    </span>

                    <span className="ml-3 text-zinc-400 dark:text-slate-500">
                      <CalendarIcon />
                    </span>
                  </button>

                  <input
                    ref={editedDateRef}
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    disabled={isSaving}
                    className="text-base absolute inset-0 h-full w-full opacity-0 color-scheme dark:color-scheme md:pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2.5 text-body font-medium text-white hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full cursor-pointer rounded-lg border border-zinc-200 px-3 py-2.5 text-body text-zinc-700 hover:bg-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <h3
                  className={`wrap-break-words whitespace-pre-wrap text-card-title text-zinc-900 dark:text-zinc-100 ${
                    todo.completed ? "line-through opacity-50" : ""
                  }`}
                >
                  {todo.title}
                </h3>

                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${
                    priorityStyles[todo.priority || "medium"]
                  }`}
                >
                  {todo.priority || "medium"}
                </span>

                {dueDateStatus && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${dueDateStatus.className}`}
                  >
                    {dueDateStatus.label}
                  </span>
                )}
              </div>

              {todo.dueDate && (
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-muted">
                  <span
                    className={`rounded-full border border-zinc-200 bg-white/70 px-2 py-0.5 dark:border-slate-700 dark:bg-slate-800/70 ${
                      todo.completed ? "line-through opacity-50" : ""
                    }`}
                  >
                    Due date: {formatDate(todo.dueDate)}
                  </span>
                </div>
              )}

              {todo.description && (
                <p
                  className={`mt-1.5 wrap-break-words whitespace-pre-wrap text-muted leading-6 ${
                    todo.completed ? "line-through opacity-50" : ""
                  }`}
                >
                  {todo.description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="relative flex w-full justify-end sm:ml-3 sm:w-auto">
          <button
            ref={actionButtonRef}
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            disabled={isSaving}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Open task actions"
            aria-expanded={isMenuOpen}
            title="More actions"
          >
            <MoreIcon />
          </button>

          {isMenuOpen &&
            createPortal(
              <div
                ref={menuRef}
                style={menuStyle}
                className="z-9999 overflow-hidden rounded-xl border border-zinc-200 bg-white/95 p-1 shadow-[0_16px_40px_rgba(15,23,42,0.14)] bg-white-xl dark:border-slate-700 dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-body font-medium text-zinc-700 hover:bg-zinc-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <EditIcon />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    requestDeleteTodo(todo);
                    setIsMenuOpen(false);
                  }}
                  className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-body font-medium text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <DeleteIcon />
                  <span>Delete</span>
                </button>
              </div>,
              document.body,
            )}
        </div>
      )}
    </div>
  );
}
