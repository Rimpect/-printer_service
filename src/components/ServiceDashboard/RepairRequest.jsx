import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faPrint,
  faComment,
  faPaperPlane,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";

export function RepairRequest({
  requests,
  selectedRequest,
  setSelectedRequest,
  repairCost,
  setRepairCost,
  workDescription,
  setWorkDescription,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faTools} />
        Закрытие заявки
      </h3>

      <div className="mb-6">
        <label
          htmlFor="requestSelect"
          className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPrint} />
          Выберите заявку для закрытия
        </label>
        <select
          id="requestSelect"
          value={selectedRequest}
          onChange={(e) => setSelectedRequest(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">-- Выберите заявку --</option>
          {requests.map((request) => (
            <option key={request.id} value={request.id}>
              {request.printer_model} -{" "}
              {request.problem_description.substring(0, 50)}...
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="repairCost"
          className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faMoneyBillWave} />
          Стоимость ремонта
        </label>
        <input
          type="number"
          id="repairCost"
          value={repairCost}
          onChange={(e) => setRepairCost(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="workDescription"
          className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faComment} />
          Описание выполненной работы
        </label>
        <textarea
          id="workDescription"
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          rows="4"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
        Закрыть заявку
      </button>
    </form>
  );
}
