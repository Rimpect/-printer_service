const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
console.log("API_BASE_URL:", API_BASE_URL);
console.log("Full login URL:", `${API_BASE_URL}/auth/login`);
// Общая функция для авторизованных запросов
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Попытка обновить токен
    const newToken = await refreshToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });
      return retryResponse;
    }
    throw new Error("Необходима авторизация");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка сервера");
  }

  return response;
};

// Обновление токена
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    return null;
  }
};

// Аутентификация
export const Login = async (login, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }), // Теперь отправляем только login
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await response.json();
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const fetchCurrentUser = async () => {
  const response = await authFetch("/auth/me");
  return await response.json();
};

// Остальные API функции
export const fetchPrinters = async () => {
  const response = await authFetch("/printers");
  return await response.json();
};

export const createServiceRequest = async (requestData) => {
  const response = await authFetch("/service-requests", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
  return await response.json();
};

export const getAllRequests = async () => {
  const response = await authFetch("/service-requests");
  return await response.json();
};

export const getAllUsers = async () => {
  const response = await authFetch("/users");
  return await response.json();
};

export const banUser = async (userId, reason) => {
  const response = await authFetch(`/users/${userId}/ban`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
  return await response.json();
};

export const unbanUser = async (userId) => {
  const response = await authFetch(`/users/${userId}/unban`, {
    method: "POST",
  });
  return await response.json();
};
