/**
 * Local storage layer.
 *
 * Tasks live in the browser (localStorage). There is no server and no account.
 * Every function is async and keeps the same signature the UI always used,
 * so this file is the only place you need to change to plug in another
 * backend (REST API, Supabase, IndexedDB, ...).
 */
import { normalizeDateOnly } from "@/utils/date";

const STORAGE_KEY = "taskify.todos.v1";
const VALID_PRIORITIES = new Set(["low", "medium", "high"]);
export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;

let memoryFallback = null;
let persistent = true;

const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const sortByOrder = (todos) =>
  [...todos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const reindex = (todos) =>
  sortByOrder(todos).map((todo, index) => ({ ...todo, order: index }));

const sanitizeStored = (raw, index) => {
  if (!raw || typeof raw !== "object") return null;

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return null;

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : makeId(),
    title,
    description:
      typeof raw.description === "string" ? raw.description.trim() : "",
    completed: raw.completed === true,
    priority: VALID_PRIORITIES.has(raw.priority) ? raw.priority : "medium",
    dueDate: normalizeDateOnly(raw.dueDate),
    order: Number.isFinite(raw.order) ? raw.order : index,
    createdAt:
      typeof raw.createdAt === "string" && raw.createdAt
        ? raw.createdAt
        : new Date().toISOString(),
  };
};

const sanitizeList = (list) => {
  if (!Array.isArray(list)) return [];

  const seen = new Set();
  const result = [];

  list.forEach((raw, index) => {
    const todo = sanitizeStored(raw, index);
    if (!todo || seen.has(todo.id)) return;

    seen.add(todo.id);
    result.push(todo);
  });

  return reindex(result);
};

const readAll = () => {
  if (!persistent) return memoryFallback ?? [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    return sanitizeList(JSON.parse(raw));
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Corrupted JSON: do not crash the app, start with an empty list.
      console.error("Stored tasks could not be parsed.", error);
      return [];
    }

    persistent = false;
    memoryFallback = [];
    return memoryFallback;
  }
};

const writeAll = (todos) => {
  const next = reindex(todos);

  if (persistent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    } catch (error) {
      console.error("Saving to localStorage failed.", error);
      persistent = false;
    }
  }

  memoryFallback = next;
  return next;
};

/**
 * Calls onChange when another browser tab changes the stored tasks.
 * Returns a function that stops listening.
 */
export const subscribeToOtherTabs = (onChange) => {
  const handleStorage = (event) => {
    // key is null when another tab cleared all site data.
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
};

/** False when the browser blocks localStorage (tasks then only live until reload). */
export const isStoragePersistent = () => persistent;

const sanitizePayload = (payload, { requireTitle = false } = {}) => {
  const updates = {};

  if ("title" in payload || requireTitle) {
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    if (!title) throw new Error("Title is required.");
    if (title.length > MAX_TITLE_LENGTH) {
      throw new Error(`Title can be at most ${MAX_TITLE_LENGTH} characters.`);
    }
    updates.title = title;
  }

  if ("description" in payload) {
    updates.description =
      typeof payload.description === "string" ? payload.description.trim() : "";
    if (updates.description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(
        `Description can be at most ${MAX_DESCRIPTION_LENGTH} characters.`,
      );
    }
  }

  if ("priority" in payload) {
    const priority = payload.priority || "medium";
    if (!VALID_PRIORITIES.has(priority)) {
      throw new Error("Priority must be low, medium, or high.");
    }
    updates.priority = priority;
  }

  if ("dueDate" in payload) {
    const dueDate = payload.dueDate || "";
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      throw new Error("Due date must use YYYY-MM-DD format.");
    }
    updates.dueDate = dueDate;
  }

  if ("completed" in payload) {
    if (typeof payload.completed !== "boolean") {
      throw new Error("completed must be a boolean.");
    }
    updates.completed = payload.completed;
  }

  return updates;
};

export const getTodos = async () => sortByOrder(readAll());

export const createTodo = async (todoData) => {
  const todos = readAll();
  const updates = sanitizePayload(todoData, { requireTitle: true });

  const newTodo = {
    id: makeId(),
    description: "",
    priority: "medium",
    dueDate: "",
    ...updates,
    completed: false,
    order: todos.length,
    createdAt: new Date().toISOString(),
  };

  writeAll([...todos, newTodo]);
  return newTodo;
};

export const updateTodo = async (id, updatedFields) => {
  const todos = readAll();
  const existing = todos.find((todo) => todo.id === id);

  if (!existing) throw new Error("Todo not found.");

  const updates = sanitizePayload(updatedFields);
  const updated = { ...existing, ...updates };

  writeAll(todos.map((todo) => (todo.id === id ? updated : todo)));
  return updated;
};

export const reorderTodos = async (orderedIds) => {
  const todos = readAll();

  if (!Array.isArray(orderedIds)) {
    throw new Error("orderedIds must be an array.");
  }

  const idSet = new Set(todos.map((todo) => todo.id));

  if (
    orderedIds.length !== todos.length ||
    new Set(orderedIds).size !== orderedIds.length ||
    !orderedIds.every((id) => idSet.has(id))
  ) {
    throw new Error("orderedIds do not match existing todos.");
  }

  const byId = new Map(todos.map((todo) => [todo.id, todo]));
  const reordered = orderedIds.map((id, index) => ({
    ...byId.get(id),
    order: index,
  }));

  return writeAll(reordered);
};

export const setAllTodosCompleted = async (completed) => {
  if (typeof completed !== "boolean") {
    throw new Error("completed must be a boolean.");
  }

  const todos = readAll();
  return writeAll(todos.map((todo) => ({ ...todo, completed })));
};

export const removeTodo = async (id) => {
  const todos = readAll();

  if (!todos.some((todo) => todo.id === id)) {
    throw new Error("Todo not found.");
  }

  writeAll(todos.filter((todo) => todo.id !== id));
  return { message: "Todo deleted successfully." };
};

export const clearCompleted = async () => {
  const todos = readAll();
  writeAll(todos.filter((todo) => !todo.completed));
  return { message: "Completed todos cleared successfully." };
};

/** JSON string of all tasks, for backups. */
export const exportTodos = () =>
  JSON.stringify(
    {
      app: "taskify",
      version: 1,
      exportedAt: new Date().toISOString(),
      todos: sortByOrder(readAll()),
    },
    null,
    2,
  );

/** Reads a Taskify backup and returns its valid tasks. Saves nothing. */
export const parseImport = (jsonText) => {
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("This file is not valid JSON.");
  }

  const list = Array.isArray(parsed) ? parsed : parsed?.todos;

  if (!Array.isArray(list)) {
    throw new Error("No tasks found in this file.");
  }

  const cleaned = sanitizeList(list);

  if (cleaned.length === 0 && list.length > 0) {
    throw new Error("None of the tasks in this file are valid.");
  }

  return cleaned;
};

/** Replaces all tasks with the given list. Returns the saved list. */
export const replaceTodos = async (todos) => writeAll(sanitizeList(todos));
