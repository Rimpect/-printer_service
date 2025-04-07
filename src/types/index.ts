export interface User {
  id: number;
  username: string;
  password: string;
  role: 'user' | 'service' | 'admin';
  fullName: string;
  position?: string;
}

export interface Printer {
  id: string;
  model: string;
  location: string;
  status: 'Работает' | 'Не работает' | 'Ремонт' | 'Списан';
}

export interface Request {
  id: number;
  printerId: string;
  userId: number;
  userName: string;
  date: string;
  status: 'Новая' | 'В обработке' | 'Выполнена' | 'Отклонена';
  problem: string;
}