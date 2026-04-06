const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/todos`;

const parseJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getTodos = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch todos.");
  }

  return data ?? [];
};

export const createTodo = async (todoData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(todoData),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create todo.");
  }

  return data;
};

export const updateTodo = async (id, updatedFields) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedFields),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update todo.");
  }

  return data;
};

export const reorderTodos = async (orderedIds) => {
  const response = await fetch(`${API_URL}/reorder`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderedIds }),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to reorder todos.");
  }

  return data;
};

export const setAllTodosCompleted = async (completed) => {
  const response = await fetch(`${API_URL}/set-all-completed`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ completed }),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update all todos.");
  }

  return data ?? [];
};

export const removeTodo = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete todo.");
  }

  return data;
};

export const clearCompleted = async () => {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to clear completed todos.");
  }

  return data;
};
