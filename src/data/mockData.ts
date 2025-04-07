import { User, Printer, Request } from '../types';

export const mockPrinters: Printer[] = [
  { id: 'PRN-001', model: 'HP LaserJet Pro M404n', location: 'Кабинет 101', status: 'Работает' },
  { id: 'PRN-002', model: 'Canon i-SENSYS LBP623Cdw', location: 'Кабинет 205', status: 'Ремонт' },
  { id: 'PRN-003', model: 'Xerox Phaser 6510DN', location: 'Кабинет 312', status: 'Работает' },
  { id: 'PRN-004', model: 'Epson L805', location: 'Библиотека', status: 'Не работает' },
  { id: 'PRN-005', model: 'Brother HL-L2350DW', location: 'Кабинет 417', status: 'Работает' },
];

export const mockUsers: User[] = [
  { id: 1, username: 'user1', password: 'pass1', role: 'user', fullName: 'Иванов Иван' },
  { id: 2, username: 'service1', password: 'pass1', role: 'service', fullName: 'Петров Сергей', position: 'Техник' },
  { id: 3, username: 'admin1', password: 'admin1', role: 'admin', fullName: 'Сидоров Алексей', position: 'Администратор' },
  { id: 4, username: 'user2', password: 'pass2', role: 'user', fullName: 'Кузнецова Мария' },
];

export const mockRequests: Request[] = [
  { id: 1, printerId: 'PRN-002', userId: 1, userName: 'Иванов Иван', date: '2023-05-15T10:15:00', status: 'В обработке', problem: 'Не печатает чёрный цвет' },
  { id: 2, printerId: 'PRN-004', userId: 4, userName: 'Кузнецова Мария', date: '2023-05-18T14:30:00', status: 'Новая', problem: 'Не включается' },
];