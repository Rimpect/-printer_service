const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// Главная функция для запросов
const authFetch = async (url, options = {}) => {
  const makeRequest = async (token) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
  };

  // Первая попытка
  let accessToken = localStorage.getItem("accessToken");
  let response = await makeRequest(accessToken);

  // Если токен истек, пробуем обновить
  if (response.status === 401) {
    try {
      const newTokens = await refreshTokens();
      if (newTokens) {
        // Повторяем запрос с новым токеном
        response = await makeRequest(newTokens.accessToken);
      } else {
        // Не удалось обновить - разлогиниваем
        throw new Error("Сессия истекла. Требуется вход.");
      }
    } catch (error) {
      console.error("Ошибка обновления токена:", error);
      throw error;
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || "Ошибка сервера");
  }

  return response;
};
// Обновление токена
const refreshTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.error("Refresh токен отсутствует");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Ошибка обновления токенов");
    }

    const data = await response.json();

    // Сохраняем новые токены
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  } catch (error) {
    console.error("Ошибка при обновлении токенов:", error);
    // Очищаем хранилище при ошибке
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

// Добавляем в ваш API-модуль (где находятся Login, logout и другие функции)
export const registerPrinter = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/AddPrinter/registerPrinter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Ошибка сервера:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Полная ошибка регистрации:", error);
    throw error;
  }
};

// Добавляем в ваш API-модуль (где находятся Login, logout и другие функции)
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Ошибка сервера:", data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Полная ошибка регистрации:", error);
    throw error;
  }
};
export const checkAvailability = async ({ login, email }) => {
  try {
    // Создаем URL с параметрами
    const url = new URL(`${API_BASE_URL}/auth/check-availability`);
    if (login) url.searchParams.append("login", login);
    if (email) url.searchParams.append("email", email);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      } catch {
        throw new Error(errorText || `Ошибка: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Check availability failed:", error);
    throw new Error(error.message || "Сервис проверки недоступен");
  }
};
// Аутентификация
export const Login = async (login, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || "Ошибка входа");
  }

  return await response.json();
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
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

export const getUserRequests = async () => {
  const response = await authFetch("/service-requests/my");
  return await response.json();
};
export const getOpenRequests = async () => {
  const response = await authFetch("/service-requests/open");
  return await response.json();
};

export const updateRequestStatus = async (requestId, status) => {
  const response = await authFetch(`/service-requests/${requestId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  return await response.json();
};

export const closeServiceRequest = async (
  requestId,
  repairCost,
  workDescription
) => {
  const response = await authFetch(`/service-requests/${requestId}/close`, {
    method: "PUT",
    body: JSON.stringify({
      repair_cost: repairCost,
      work_description: workDescription,
    }),
  });
  return await response.json();
};
export const updateServiceCenter = async (requestId, serviceCenterId) => {
  const response = await authFetch(`/service-requests/${requestId}/assign`, {
    method: "PUT",
    body: JSON.stringify({ service_center_id: serviceCenterId }),
  });
  return await response.json();
};

export const getAssignedRequests = async () => {
  const response = await authFetch("/service-requests/assigned");
  return await response.json();
};
// Альтернативно, можно использовать существующую функцию с параметром
export const getRequestsByStatus = async (status) => {
  const response = await authFetch(`/service-requests?status=${status}`);
  return await response.json();
};
