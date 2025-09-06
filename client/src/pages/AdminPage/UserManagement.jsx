import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); 
  const [printers, setPrinters] = useState([]);
  
  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Фильтрация принтеров по поисковому запросу
  const filteredPrinters = printers.filter(printer => 
    printer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    printer.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId) => {
    // Логика удаления пользователя
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleDeletePrinter = (printerId) => {
    // Логика удаления принтера
    setPrinters(printers.filter(printer => printer.id !== printerId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Поиск пользователей или принтеров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-3 text-gray-400"
          />
        </div>
      </div>

      {/* Секция управления пользователями */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="px-6 py-3 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Пользователи</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role === 'admin' ? 'Администратор' : 
                   user.role === 'service' ? 'Сервис' : 'Пользователь'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Секция управления принтерами */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
        <h2 className="px-6 py-3 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Принтеры</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Модель</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrinters.map(printer => (
              <tr key={printer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{printer.name}</div>
                      <div className="text-sm text-gray-500">{printer.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {printer.model}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeletePrinter(printer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}