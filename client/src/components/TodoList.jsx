import { useEffect, useState } from "react";
import TodoItem from "@/components/TodoItem";

function EmptyState({ title, message, emoji = "📝" }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 p-5 text-center bg-white sm:rounded-2xl sm:p-6 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-xl sm:h-12 sm:w-12 dark:bg-slate-800">
        {emoji}
      </div>

      <h3 className="text-card-title text-zinc-800 dark:text-zinc-100">
        {title}
      </h3>

      <p className="mt-1.5 text-muted">{message}</p>
    </div>
  );
}

export default function TodoList({
  todos,
  allTodos,
  toggleTodo,
  requestDeleteTodo,
  editTodo,
  requestClearCompleted,
  moveTodo,
  filter,
  searchTerm,
  hasAnyTodos,
  hasCompletedTodos,
  deletingTodoId,
  clearingCompletedIds,
  savingTodoId,
}) {
  const [draggedTodoId, setDraggedTodoId] = useState(null);
  const [dragOverTodoId, setDragOverTodoId] = useState(null);
  const [visibleIds, setVisibleIds] = useState([]);

  const completedCount = allTodos.filter((todo) => todo.completed).length;

  useEffect(() => {
    setVisibleIds([]);

    const timers = todos.map((todo, index) =>
      setTimeout(() => {
        setVisibleIds((prev) => [...prev, todo.id]);
      }, index * 70),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [todos]);

  const handleDragStart = (todoId) => {
    setDraggedTodoId(todoId);
  };

  const handleDragOver = (event, todoId) => {
    event.preventDefault();
    setDragOverTodoId(todoId);
  };

  const handleDrop = (targetTodoId) => {
    if (!draggedTodoId || draggedTodoId === targetTodoId) {
      setDraggedTodoId(null);
      setDragOverTodoId(null);
      return;
    }

    moveTodo(draggedTodoId, targetTodoId);
    setDraggedTodoId(null);
    setDragOverTodoId(null);
  };

  const handleDragEnd = () => {
    setDraggedTodoId(null);
    setDragOverTodoId(null);
  };

  if (todos.length === 0) {
    let emptyTitle = "No tasks found";
    let emptyMessage = "Add a new task or change the filter.";
    let emptyEmoji = "📝";

    if (!hasAnyTodos) {
      emptyTitle = "No tasks yet";
      emptyMessage = "Create your first task to get started.";
      emptyEmoji = "✨";
    } else if (searchTerm.trim()) {
      emptyTitle = "No matching tasks";
      emptyMessage = `Nothing matched "${searchTerm}". Try another keyword.`;
      emptyEmoji = "🔎";
    } else if (filter === "active") {
      emptyTitle = "All tasks completed";
      emptyMessage = "Nice work. You have no active tasks right now.";
      emptyEmoji = "✅";
    } else if (filter === "completed" && !hasCompletedTodos) {
      emptyTitle = "No completed tasks";
      emptyMessage = "Complete a task and it will appear here.";
      emptyEmoji = "📌";
    } else if (filter === "completed") {
      emptyTitle = "No tasks in this view";
      emptyMessage = "Try switching the filter to see more tasks.";
      emptyEmoji = "📂";
    }

    return (
      <>
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          emoji={emptyEmoji}
        />

        <div className="mt-5 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 text-muted sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <span>{allTodos.length} tasks total</span>

          <div className="flex flex-wrap items-center gap-2.5">
            <span>{completedCount} completed</span>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={requestClearCompleted}
                className="min-h-10 cursor-pointer rounded-lg border border-zinc-200 px-3 py-2 text-muted font-medium hover:bg-zinc-100 active:scale-[0.98] dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-2.5">
        {todos.map((todo, index) => {
          const isVisible = visibleIds.includes(todo.id);
          const isRemoving =
            deletingTodoId === todo.id ||
            clearingCompletedIds.includes(todo.id);

          return (
            <div
              key={todo.id}
              onDragOver={(event) => handleDragOver(event, todo.id)}
              onDrop={() => handleDrop(todo.id)}
              className={`transition-all duration-300 ${
                isRemoving
                  ? "scale-95 opacity-0"
                  : isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
              }`}
              style={{
                transitionDelay: isRemoving ? "0ms" : `${index * 20}ms`,
              }}
            >
              <TodoItem
                todo={todo}
                toggleTodo={toggleTodo}
                requestDeleteTodo={requestDeleteTodo}
                editTodo={editTodo}
                isDragging={draggedTodoId === todo.id}
                isDragOver={dragOverTodoId === todo.id}
                onDragStart={() => handleDragStart(todo.id)}
                onDragEnd={handleDragEnd}
                isSaving={savingTodoId === todo.id}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2.5 border-t border-zinc-200 pt-3 text-muted sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <span>{allTodos.length} tasks total</span>

        <div className="flex flex-wrap items-center gap-2.5">
          <span>{completedCount} completed</span>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={requestClearCompleted}
              className="min-h-10 cursor-pointer rounded-lg border border-zinc-200 px-3 py-2 text-muted font-medium hover:bg-zinc-100 active:scale-[0.98] dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>
    </>
  );
}
