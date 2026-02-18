
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5189";

/**
 * Базова функція для всіх API запитів
 * Автоматично додає JWT токен до headers
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Отримуємо JWT токен з localStorage
  const token = localStorage.getItem('jwt_token');

  // Формуємо headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Додаємо Authorization header якщо є токен
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Якщо 401 - токен невалідний або відсутній
    if (response.status === 401) {
      // Видаляємо невалідний токен
      localStorage.removeItem('jwt_token');
      
      // Якщо не на сторінці логіну - перенаправляємо
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }

      throw new Error('Unauthorized - Please login');
    }

    // Інші помилки
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Якщо відповідь порожня (DELETE зазвичай повертає 204)
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