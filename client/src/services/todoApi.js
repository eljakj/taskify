console.log("TODO API URL:", `${import.meta.env.VITE_API_URL}/api/todos`);

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

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

const getToken = () => localStorage.getItem("token");

const getAuthHeaders = (includeJson = true) => {
  const token = getToken();

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleRequest = async (
  url,
  options = {},
  fallbackMessage,
  fallbackData = null,
) => {
  try {
    const response = await fetch(url, options);
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      console.error("Todo API Error:", data);
      throw new Error(data?.message || fallbackMessage);
    }

    return data ?? fallbackData;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }

    throw error;
  }
};

export const getTodos = async () => {
  return handleRequest(
    API_URL,
    {
      headers: getAuthHeaders(false),
    },
    "Failed to fetch todos.",
    [],
  );
};

export const createTodo = async (todoData) => {
  return handleRequest(
    API_URL,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(todoData),
    },
    "Failed to create todo.",
  );
};

export const updateTodo = async (id, updatedFields) => {
  return handleRequest(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedFields),
    },
    "Failed to update todo.",
  );
};

export const reorderTodos = async (orderedIds) => {
  return handleRequest(
    `${API_URL}/reorder`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds }),
    },
    "Failed to reorder todos.",
  );
};

export const setAllTodosCompleted = async (completed) => {
  return handleRequest(
    `${API_URL}/set-all-completed`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed }),
    },
    "Failed to update all todos.",
    [],
  );
};

export const removeTodo = async (id) => {
  return handleRequest(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(false),
    },
    "Failed to delete todo.",
  );
};

export const clearCompleted = async () => {
  return handleRequest(
    API_URL,
    {
      method: "DELETE",
      headers: getAuthHeaders(false),
    },
    "Failed to clear completed todos.",
  );
};
