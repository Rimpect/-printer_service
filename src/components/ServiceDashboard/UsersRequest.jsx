import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faInbox,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
export function UsersRequest({ openRequests, onTakeRequest }) {
  // Добавьте форматирование даты как в MyRequests
  const formatDate = (dateString) => {
    if (!dateString) return "Нет данных";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("ru-RU", options);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6">Открытые заявки</h3>

      {openRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Нет открытых заявок</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  №
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Принтер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Проблема
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {openRequests.map((request, index) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.printer_model || "Неизвестная модель"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.user_login || "Неизвестный пользователь"}
                  </td>
                  <td className="px-6 py-4">
                    {request.problem_description
                      ? `${request.problem_description.substring(0, 50)}...`
                      : "Нет описания"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onTakeRequest(request.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Взять в работу
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
