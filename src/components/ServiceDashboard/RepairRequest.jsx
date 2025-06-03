import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faPrint,
  faComment,
  faPaperPlane,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
export function UsersRequest({ openRequests, onTakeRequest }) {
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
              {openRequests.map((request, index) => {
                // Проверка и нормализация данных
                const printerModel =
                  request.printer_model ||
                  request.printer?.model ||
                  "Не указан";

                const userLogin =
                  request.user_login || request.user?.login || "Не указан";

                const problemDescription = request.problem_description
                  ? `${request.problem_description.substring(0, 50)}...`
                  : "Нет описания";

                return (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {printerModel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{userLogin}</td>
                    <td className="px-6 py-4">{problemDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.created_at
                        ? new Date(request.created_at).toLocaleString()
                        : "Нет данных"}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
