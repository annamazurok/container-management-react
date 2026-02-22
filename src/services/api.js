const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7094";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = localStorage.getItem("jwt_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Видаляємо невалідний токен
      localStorage.removeItem("jwt_token");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      throw new Error("Unauthorized - Please login");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export { API_BASE_URL };
