const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AUTH_URL = `${API_BASE_URL}/api/auth`;

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

export const registerUser = async (userData) => {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to register.");
  }

  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to login.");
  }

  return data;
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${AUTH_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch user.");
  }

  return data;
};
