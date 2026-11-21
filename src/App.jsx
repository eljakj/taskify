import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import ProgressOverview from "@/components/ProgressOverview";
import TodoForm from "@/components/TodoForm";
import FilterBar from "@/components/FilterBar";
import TodoList from "@/components/TodoList";
import SearchBar from "@/components/SearchBar";
import ConfirmModal from "@/components/ConfirmModal";
import ToastContainer from "@/components/ToastContainer";
import TodoListSkeleton from "@/components/TodoListSkeleton";
import ErrorState from "@/components/ErrorState";
import DataMenu from "@/components/DataMenu";
import { useTheme } from "@/hooks/useTheme";
import { normalizeDateOnly, parseDateOnly } from "@/utils/date";
import {
  getTodos,
  createTodo,
  updateTodo,
  reorderTodos,
  setAllTodosCompleted,
  removeTodo,
  clearCompleted,
  isStoragePersistent,
} from "@/services/todoApi";

const priorityRank = {
  high: 0,
  medium: 1,
  low: 2,
};

const initialConfirmState = {
  isOpen: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  isDanger: false,
  type: null,
  todoId: null,
};

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("manual");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [confirmState, setConfirmState] = useState(initialConfirmState);
  const [notifications, setNotifications] = useState([]);
  const [deletingTodoId, setDeletingTodoId] = useState(null);
  const [clearingCompletedIds, setClearingCompletedIds] = useState([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [savingTodoId, setSavingTodoId] = useState(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const pushNotification = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;

    setNotifications((prev) => [
      {
        id,
        message,
        type,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const fetchTodos = useCallback(
    async ({ retry = false } = {}) => {
      try {
        if (retry) {
          setIsRetrying(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage("");
        const data = await getTodos();
        setTodos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);


        setErrorMessage("Failed to load todos from server.");
        pushNotification("Failed to load todos", "error");
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    [pushNotification],
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const normalizedTodos = useMemo(() => {
    return todos.map((todo, index) => ({
      ...todo,
      description: todo.description || "",
      priority: todo.priority || "medium",
      dueDate: normalizeDateOnly(todo.dueDate),
      order: todo.order ?? index,
      createdAt: todo.createdAt || new Date(0).toISOString(),
    }));
  }, [todos]);

  const allCompleted =
    normalizedTodos.length > 0 &&
    normalizedTodos.every((todo) => todo.completed);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalCount = normalizedTodos.length;
  const completedCount = normalizedTodos.filter(
    (todo) => todo.completed,
  ).length;
  const activeCount = totalCount - completedCount;

  const overdueCount = normalizedTodos.filter((todo) => {
    if (!todo.dueDate || todo.completed) return false;

    const dueDate = parseDateOnly(todo.dueDate);

    return dueDate !== null && dueDate < today;
  }).length;

  const closeConfirmModal = () => {
    if (isConfirmLoading) return;
    setConfirmState(initialConfirmState);
  };

  const addTodo = async ({ title, description, priority, dueDate }) => {
    try {
      setIsAddingTodo(true);
      setErrorMessage("");

      const newTodo = await createTodo({
        title,
        description,
        priority,
        dueDate,
      });

      if (!newTodo) {
        throw new Error("No todo returned from server.");
      }

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      pushNotification("Task created");
      return true;
    } catch (error) {
      console.error(error);


      setErrorMessage(error.message || "Failed to add todo.");
      pushNotification("Failed to add task", "error");
      return false;
    } finally {
      setIsAddingTodo(false);
    }
  };

  const toggleTodo = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id);
    if (!currentTodo) return;

    try {
      setErrorMessage("");
      const updatedTodo = await updateTodo(id, {
        completed: !currentTodo.completed,
      });

      if (!updatedTodo) {
        throw new Error("No updated todo returned from server.");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );

      pushNotification(
        updatedTodo.completed ? "Task completed" : "Task marked active",
      );
    } catch (error) {
      console.error(error);


      setErrorMessage(error.message || "Failed to update todo.");
      pushNotification("Failed to update task", "error");
    }
  };

  const toggleAllTodos = async () => {
    if (normalizedTodos.length === 0) return;

    const nextCompletedValue = !allCompleted;

    try {
      setErrorMessage("");
      const updatedTodos = await setAllTodosCompleted(nextCompletedValue);
      setTodos(Array.isArray(updatedTodos) ? updatedTodos : []);

      pushNotification(
        nextCompletedValue ? "All tasks selected" : "All tasks deselected",
      );
    } catch (error) {
      console.error(error);


      setErrorMessage(error.message || "Failed to update all todos.");
      pushNotification("Failed to update all todos", "error");
    }
  };

  const deleteTodo = async (id) => {
    try {
      setErrorMessage("");
      await removeTodo(id);

      setTodos((prevTodos) =>
        prevTodos
          .filter((todo) => todo.id !== id)
          .map((todo, index) => ({
            ...todo,
            order: index,
          })),
      );

      pushNotification("Task deleted");
    } catch (error) {
      console.error(error);


      setErrorMessage(error.message || "Failed to delete todo.");
      pushNotification("Failed to delete task", "error");
    }
  };

  const requestDeleteTodo = (todo) => {
    setConfirmState({
      isOpen: true,
      title: "Delete task",
      message: `Are you sure you want to delete "${todo.title}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDanger: true,
      type: "delete",
      todoId: todo.id,
    });
  };

  const editTodo = async (id, updatedFields) => {
    try {
      setSavingTodoId(id);
      setErrorMessage("");

      const updatedTodo = await updateTodo(id, updatedFields);

      if (!updatedTodo) {
        throw new Error("No updated todo returned from server.");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );

      pushNotification("Task updated");
      return true;
    } catch (error) {
      console.error(error);


      setErrorMessage(error.message || "Failed to edit todo.");
      pushNotification("Failed to update task", "error");
      return false;
    } finally {
      setSavingTodoId(null);
    }
  };

  const clearCompletedTodos = async () => {
    try {
      setErrorMessage("");
      await clearCompleted();

      setTodos((prevTodos) =>
        prevTodos
          .filter((todo) => !todo.completed)
          .map((todo, index) => ({
            ...todo,
            order: index,
          })),
      );

      pushNotification("Completed tasks cleared");
    } catch (error) {
      console.error(error);


      setErrorMessage(error.message || "Failed to clear completed todos.");
      pushNotification("Failed to clear completed tasks", "error");
    }
  };

  const requestClearCompleted = () => {
    setConfirmState({
      isOpen: true,
      title: "Clear completed tasks",
      message: "Are you sure you want to remove all completed tasks?",
      confirmText: "Clear",
      cancelText: "Cancel",
      isDanger: true,
      type: "clearCompleted",
      todoId: null,
    });
  };

  const handleConfirmAction = async () => {
    const { type, todoId } = confirmState;

    if (type === "delete" && todoId) {
      setIsConfirmLoading(true);
      setConfirmState(initialConfirmState);
      setDeletingTodoId(todoId);

      window.setTimeout(async () => {
        await deleteTodo(todoId);
        setDeletingTodoId(null);
        setIsConfirmLoading(false);
      }, 180);

      return;
    }

    if (type === "clearCompleted") {
      const completedIds = normalizedTodos
        .filter((todo) => todo.completed)
        .map((todo) => todo.id);

      if (completedIds.length === 0) return;

      setIsConfirmLoading(true);
      setConfirmState(initialConfirmState);
      setClearingCompletedIds(completedIds);

      window.setTimeout(async () => {
        await clearCompletedTodos();
        setClearingCompletedIds([]);
        setIsConfirmLoading(false);
      }, 220);
    }
  };

  const moveTodo = async (draggedId, targetId) => {
    if (filter !== "all" || searchTerm.trim() || sortBy !== "manual") {
      setErrorMessage(
        "Drag and drop works only in All view without search and with Manual sorting.",
      );
      pushNotification("Switch to All + Manual to reorder", "error");
      return;
    }

    const fromIndex = todos.findIndex((todo) => todo.id === draggedId);
    const toIndex = todos.findIndex((todo) => todo.id === targetId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return;
    }

    const updatedTodos = [...todos];
    const [movedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedTodo);

    const reorderedTodos = updatedTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    setTodos(reorderedTodos);

    try {
      setErrorMessage("");
      const orderedIds = reorderedTodos.map((todo) => todo.id);
      const savedTodos = await reorderTodos(orderedIds);

      if (!Array.isArray(savedTodos)) {
        throw new Error("No reordered todos returned from server.");
      }

      setTodos(savedTodos);
      pushNotification("Task order updated");
    } catch (error) {
      console.error(error);


      setErrorMessage(error.message || "Failed to save todo order.");
      pushNotification("Failed to save task order", "error");

      try {
        const freshTodos = await getTodos();
        setTodos(Array.isArray(freshTodos) ? freshTodos : []);
      } catch (reloadError) {
        console.error(reloadError);
      }
    }
  };

  const filteredTodos = useMemo(() => {
    let result = [...normalizedTodos];

    if (filter === "active") {
      result = result.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();

      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(lowerSearch) ||
          todo.description.toLowerCase().includes(lowerSearch) ||
          todo.priority.toLowerCase().includes(lowerSearch) ||
          todo.dueDate.toLowerCase().includes(lowerSearch),
      );
    }

    if (sortBy === "manual") {
      result.sort((a, b) => a.order - b.order);
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    if (sortBy === "priority") {
      result.sort((a, b) => {
        const diff = priorityRank[a.priority] - priorityRank[b.priority];
        if (diff !== 0) return diff;
        return a.order - b.order;
      });
    }

    if (sortBy === "dueDate") {
      result.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return a.order - b.order;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (
          new Date(`${a.dueDate}T00:00:00`).getTime() -
          new Date(`${b.dueDate}T00:00:00`).getTime()
        );
      });
    }

    return result;
  }, [normalizedTodos, filter, searchTerm, sortBy]);

  return (
    <div className="min-h-dvh px-6 py-8 text-zinc-800  dark:text-white ">
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        isDanger={confirmState.isDanger}
        onCancel={closeConfirmModal}
        onConfirm={handleConfirmAction}
        isLoading={isConfirmLoading}
      />

      <main className="mx-auto max-w-3xl pb-[max(1rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <StatsBar
          total={totalCount}
          active={activeCount}
          completed={completedCount}
          overdue={overdueCount}
        />

        <ProgressOverview
          total={totalCount}
          completed={completedCount}
          active={activeCount}
          overdue={overdueCount}
        />

        <section className="rounded-[1.25rem] border border-zinc-200 bg-white p-3  sm:rounded-[1.75rem] sm:p-4 dark:border-slate-700 dark:bg-slate-900/70 ">
          <TodoForm addTodo={addTodo} isAdding={isAddingTodo} />

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <FilterBar
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            allCompleted={allCompleted}
            toggleAllCompleted={toggleAllTodos}
            hasTodos={normalizedTodos.length > 0}
          />

          <div className="mb-4 flex flex-wrap justify-end gap-2 text-muted dark:text-slate-500">
            <span>
              {filter === "all" && !searchTerm.trim() && sortBy === "manual"
                ? "Drag and drop is available in this view."
                : "Drag and drop is unavailable while filtering, searching, or sorting."}
            </span>
          </div>

          {!isLoading && !isStoragePersistent() && (
            <div
              className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-body text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
              role="status"
            >
              Your browser blocks local storage. Tasks are kept only until you
              reload the page. Use Export to save a backup.
            </div>
          )}

          {errorMessage && !isLoading && normalizedTodos.length > 0 && (
            <div
              className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-body text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <TodoListSkeleton />
          ) : errorMessage && normalizedTodos.length === 0 ? (
            <ErrorState
              title="Unable to load tasks"
              message={errorMessage}
              onRetry={() => fetchTodos({ retry: true })}
              isRetrying={isRetrying}
            />
          ) : (
            <TodoList
              todos={filteredTodos}
              allTodos={normalizedTodos}
              toggleTodo={toggleTodo}
              requestDeleteTodo={requestDeleteTodo}
              editTodo={editTodo}
              requestClearCompleted={requestClearCompleted}
              moveTodo={moveTodo}
              filter={filter}
              searchTerm={searchTerm}
              hasAnyTodos={normalizedTodos.length > 0}
              hasCompletedTodos={normalizedTodos.some((todo) => todo.completed)}
              deletingTodoId={deletingTodoId}
              clearingCompletedIds={clearingCompletedIds}
              savingTodoId={savingTodoId}
            />
          )}

          <DataMenu
            onImported={(importedTodos) => {
              setTodos(importedTodos);
              setErrorMessage("");
              pushNotification("Tasks imported");
            }}
            onError={(message) => pushNotification(message, "error")}
          />
        </section>
      </main>

      <ToastContainer
        notifications={notifications}
        dismissNotification={dismissNotification}
      />
    </div>
  );
}
