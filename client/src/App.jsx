import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import ProgressOverview from "./components/ProgressOverview";
import TodoForm from "./components/TodoForm";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";
import SearchBar from "./components/SearchBar";
import ConfirmModal from "./components/ConfirmModal";
import ToastContainer from "./components/ToastContainer";
import TodoListSkeleton from "./components/TodoListSkeleton";
import ErrorState from "./components/ErrorState";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useTheme } from "./hooks/useTheme";
import { getCurrentUser } from "./services/authApi";
import {
  getTodos,
  createTodo,
  updateTodo,
  reorderTodos,
  setAllTodosCompleted,
  removeTodo,
  clearCompleted,
} from "./services/todoApi";

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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthChecking, setIsAuthChecking] = useState(true);

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

  const pushNotification = (message, type = "success") => {
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
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTodos([]);
    setErrorMessage("");
    setAuthMode("login");
    pushNotification("Logged out");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthChecking(false);
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch (error) {
        console.error(error);

        const message = error.message?.toLowerCase() || "";

        if (
          message.includes("invalid token") ||
          message.includes("unauthorized") ||
          message.includes("user not found")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  const fetchTodos = async ({ retry = false } = {}) => {
    try {
      if (retry) {
        setIsRetrying(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage("");
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error(error);

      if (
        error.message?.toLowerCase().includes("unauthorized") ||
        error.message?.toLowerCase().includes("invalid token")
      ) {
        handleLogout();
        return;
      }

      setErrorMessage("Failed to load todos from server.");
      pushNotification("Failed to load todos", "error");
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    fetchTodos();
  }, [user]);

  const normalizedTodos = useMemo(() => {
    return todos.map((todo, index) => ({
      ...todo,
      description: todo.description || "",
      priority: todo.priority || "medium",
      dueDate: todo.dueDate || "",
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

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }).length;

  const closeConfirmModal = () => {
    if (isConfirmLoading) return;
    setConfirmState(initialConfirmState);
  };

  const addTodo = async ({ title, description, priority, dueDate }) => {
    try {
      setIsAddingTodo(true);
      setErrorMessage("");

      const [newTodo] = await Promise.all([
        createTodo({
          title,
          description,
          priority,
          dueDate,
        }),
        wait(500),
      ]);

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
      setTodos(updatedTodos);

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

      const [updatedTodo] = await Promise.all([
        updateTodo(id, updatedFields),
        wait(500),
      ]);

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

      setTimeout(async () => {
        await Promise.all([deleteTodo(todoId), wait(500)]);
        setDeletingTodoId(null);
        setIsConfirmLoading(false);
      }, 220);

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

      setTimeout(async () => {
        await Promise.all([clearCompletedTodos(), wait(500)]);
        setClearingCompletedIds([]);
        setIsConfirmLoading(false);
      }, 260);
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
        setTodos(freshTodos);
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
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    return result;
  }, [normalizedTodos, filter, searchTerm, sortBy]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-950 text-zinc-900 dark:text-white">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return authMode === "login" ? (
      <LoginPage
        onLogin={(loggedInUser) => setUser(loggedInUser)}
        onSwitchToRegister={() => setAuthMode("register")}
      />
    ) : (
      <RegisterPage
        onRegister={(registeredUser) => setUser(registeredUser)}
        onSwitchToLogin={() => setAuthMode("login")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-zinc-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.22),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-white">
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

      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-zinc-500 dark:text-slate-400">
              Logged in as
            </p>
            <p className="font-semibold">{user.name}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-slate-700 dark:hover:bg-slate-800 sm:w-auto"
          >
            Logout
          </button>
        </div>

        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          notifications={notifications}
          dismissNotification={dismissNotification}
          clearNotifications={clearNotifications}
        />

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

        <section className="rounded-[1.5rem] border border-white/60 bg-white/75 p-3 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-colors duration-300 sm:rounded-[2rem] sm:p-6 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
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

          <div className="mb-4 flex justify-end text-xs text-zinc-400 dark:text-slate-500">
            <span>
              {filter === "all" && !searchTerm.trim() && sortBy === "manual"
                ? "Drag enabled"
                : "Drag disabled"}
            </span>
          </div>

          {errorMessage && !isLoading && normalizedTodos.length > 0 && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
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
        </section>
      </div>

      <ToastContainer
        notifications={notifications}
        dismissNotification={dismissNotification}
      />
    </div>
  );
}
