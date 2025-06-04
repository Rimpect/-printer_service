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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-3 rounded-lg shadow-md max-w-full mx-2 overflow-hidden"
      autoComplete="off"
    >
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <FontAwesomeIcon
          icon={faTools}
          className="text-blue-500 min-w-[16px]"
        />
        <span className="truncate">Закрытие заявки</span>
      </h3>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faPrint}
            className="text-gray-500 min-w-[12px]"
          />
          <span>Выберите заявку</span>
        </label>
        <select
          value={selectedRequest}
          onChange={(e) => setSelectedRequest(e.target.value)}
          className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 truncate"
          required
        >
          <option value="">-- Выберите --</option>
          {requests.map((request) => (
            <option key={request.id} value={request.id} className="truncate">
              {request.printer_model} -{" "}
              {request.problem_description.substring(0, 20)}...
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faMoneyBillWave}
            className="text-gray-500 min-w-[12px]"
          />
          <span>Стоимость</span>
        </label>
        <input
          type="number"
          value={repairCost}
          onChange={(e) => setRepairCost(e.target.value)}
          className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          inputMode="numeric"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
          <FontAwesomeIcon
            icon={faComment}
            className="text-gray-500 min-w-[12px]"
          />
          <span>Описание работы</span>
        </label>
        <textarea
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          rows="3"
          placeholder="Опишите работу..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2 text-xs"
      >
        <FontAwesomeIcon icon={faPaperPlane} className="min-w-[12px]" />
        <span>Закрыть заявку</span>
      </button>
    </form>
  );
}
