import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faInbox,
  faUser,
  faPrint,
  faCalendarAlt,
  faCommentAlt,
  faTools,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

export function UsersRequest({ openRequests, onTakeRequest }) {
  // Форматирование даты с учетом возможного отсутствия значения
  const formatDate = (dateString) => {
    if (!dateString) return "Дата не указана";
    try {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleString("ru-RU", options);
    } catch {
      return "Некорректная дата";
    }
  };

  // Определение статуса заявки
  const getStatusIndicator = (status) => {
    switch (status?.toLowerCase()) {
      case "in_progress":
        return { color: "text-yellow-500", label: "В работе" };
      case "closed":
        return { color: "text-green-500", label: "Завершена" };
      case "open":
      default:
        return { color: "text-blue-500", label: "Открыта" };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Заголовок */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faListUl} className="text-blue-600" />
          <span>Открытые заявки</span>
          <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {openRequests.length}
          </span>
        </h2>
      </div>

      {/* Контент */}
      <div className="p-2 sm:p-4">
        {openRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon
              icon={faInbox}
              className="text-4xl mb-3 text-gray-200"
            />
            <p className="text-gray-600">Нет доступных заявок</p>
          </div>
        ) : (
          <>
            {/* Десктопная таблица (скрыта на мобильных) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      №
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Принтер
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Проблема
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {openRequests.map((request, index) => {
                    const status = getStatusIndicator(request.status);
                    return (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faPrint}
                              className="text-gray-400"
                            />
                            {request.printer_model || "Не указан"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-gray-400"
                            />
                            {request.user_login || "Не указан"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {request.problem_description || "Нет описания"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.created_at)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faCircle}
                              className={`text-xs mr-2 ${status.color}`}
                            />
                            <span className="text-sm">{status.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => onTakeRequest(request.id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Принять
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Мобильные карточки (скрыты на десктопе) */}
            <div className="md:hidden space-y-3">
              {openRequests.map((request, index) => {
                const status = getStatusIndicator(request.status);
                return (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">№{index + 1}</span>
                        <FontAwesomeIcon
                          icon={faCircle}
                          className={`text-xs ${status.color}`}
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(request.created_at)}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faPrint}
                          className="text-gray-400 mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {request.printer_model || "Принтер не указан"}
                          </h3>
                          <p className="text-xs text-gray-500">Модель принтера</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-gray-400 mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {request.user_login || "Пользователь не указан"}
                          </h3>
                          <p className="text-xs text-gray-500">Автор заявки</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon
                          icon={faCommentAlt}
                          className="text-gray-400 mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {request.problem_description || "Нет описания"}
                          </h3>
                          <p className="text-xs text-gray-500">Описание проблемы</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => onTakeRequest(request.id)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FontAwesomeIcon icon={faTools} />
                        Взять в работу
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}