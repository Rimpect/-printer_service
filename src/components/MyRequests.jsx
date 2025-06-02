import { useState, useEffect } from 'react';
import { getAllRequests } from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faListUl, 
  faInbox, 
  faPrint, 
  faCalendarAlt, 
  faExclamationCircle,
  faCheckCircle,
  faSpinner,
  faClock
} from '@fortawesome/free-solid-svg-icons';

export function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const data = await getAllRequests();
        setRequests(data);
      } catch (error) {
        setError('Не удалось загрузить заявки');
        console.error('Ошибка:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, []);

  // Функция для преобразования статуса
  const getStatusDisplay = (status) => {
    if (!status) return { text: 'Новый', icon: faClock, class: 'bg-gray-100' };
    
    switch(status.toLowerCase()) {
      case 'closed':
        return { text: 'Выполнено', icon: faCheckCircle, class: 'bg-green-100 text-green-800' };
      case 'in_progress':
        return { text: 'В работе', icon: faSpinner, class: 'bg-yellow-100 text-yellow-800' };
      case 'open':
        return { text: 'Открыта', icon: faClock, class: 'bg-blue-100 text-blue-800' };
      default:
        return { text: status, icon: faClock, class: 'bg-gray-100' };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-600">Загрузка заявок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center py-8 text-red-500">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faListUl} className="text-blue-500" />
        История моих заявок
      </h3>
      
      {requests.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <FontAwesomeIcon icon={faInbox} className="text-4xl mb-3 text-gray-300" />
          <p className="text-gray-600">У вас пока нет отправленных заявок</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FontAwesomeIcon icon={faPrint} className="mr-1" /> Принтер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" /> Проблема
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request, index) => {
                const status = getStatusDisplay(request['Статус']);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request['Модель принтера'] || 'Неизвестный принтер'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request['Дата начала']).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {request['Комментарий']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${status.class}`}>
                        <FontAwesomeIcon icon={status.icon} />
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}