const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

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

const handleRequest = async (url, options = {}, fallbackMessage) => {
  try {
    const response = await fetch(url, options);
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      console.error("Auth API Error:", data);
      throw new Error(data?.message || fallbackMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }

    throw error;
  }
};

export const registerUser = async (userData) => {
  return handleRequest(
    `${AUTH_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    },
    "Failed to register.",
  );
};

export const loginUser = async (credentials) => {
  return handleRequest(
    `${AUTH_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    },
    "Failed to login.",
  );
};

export const getCurrentUser = async (token) => {
  return handleRequest(
    `${AUTH_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    "Failed to fetch user.",
  );
};
