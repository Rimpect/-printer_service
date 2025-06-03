const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
console.log("API_BASE_URL:", API_BASE_URL);
console.log("Full login URL:", `${API_BASE_URL}/auth/login`);
// Общая функция для авторизованных запросов
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");
  console.log("[authFetch] Request to:", url, "Token exists:", !!token);
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
// Добавляем в ваш API-модуль (где находятся Login, logout и другие функции)
export const registerUser = async (userData) => {
  try {
    console.log(
      "Отправка данных регистрации:",
      JSON.stringify(userData, null, 2)
    );

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

    console.log("Успешная регистрация:", data);
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

export const fetchCurrentUser = async () => {
  const response = await authFetch("/auth/me");
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
