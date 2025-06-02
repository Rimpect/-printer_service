// src/api/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Получение всех принтеров
export const fetchPrinters = async () => {
  const response = await fetch(`${API_BASE_URL}/printers`);
  if (!response.ok) throw new Error('Ошибка при загрузке принтеров');
  return await response.json();
};

// Создание новой сервисной заявки
export const createServiceRequest = async (requestData) => {
  const response = await fetch(`${API_BASE_URL}/service-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) throw new Error('Ошибка при создании заявки');
  return await response.json();
};

// Получение всех заявок (если нужно)
export const getAllRequests = async () => {
   try {
    const response = await fetch(`${API_BASE_URL}/service-requests`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка сервера:', errorData);
      throw new Error(errorData.error || 'Ошибка сервера');
    }

    return await response.json();
  } catch (error) {
    // console.error('Ошибка запроса:', error);
    throw error;
  }
};