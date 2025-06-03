import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faPrint,
  faExclamationTriangle,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { fetchPrinters, createServiceRequest } from "../api/api";

export function NewRequest() {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        const data = await fetchPrinters();
        setPrinters(data);
      } catch (error) {
        console.error("Error loading printers:", error);
      }
    };
    loadPrinters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      console.log("Отправка данных:", {
        printer_id: selectedPrinter,
        problem_description: problemDescription
      });

      const response = await createServiceRequest({
        printer_id: Number(selectedPrinter), // Убедимся, что это число
        problem_description: problemDescription,
      });

      console.log("Ответ сервера:", response);
      alert("Заявка успешно создана!");
      setSelectedPrinter("");
      setProblemDescription("");
    } catch (error) {
      console.error("Полная ошибка создания заявки:", error);
      setError(error.message || "Ошибка при создании заявки");
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faTools} />
        Форма обращения в сервисный центр
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faPrint} />
          Выберите принтер
        </label>
        <select
          value={selectedPrinter}
          onChange={(e) => setSelectedPrinter(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
          required
          disabled={isSubmitting}
        >
          <option value="">-- Выберите принтер --</option>
          {printers.map((printer) => (
            <option key={printer.id} value={printer.id}>
              {printer.model} ({printer.location})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          Описание проблемы
        </label>
        <textarea
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          rows="4"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Отправка..."
        ) : (
          <>
            <FontAwesomeIcon icon={faPaperPlane} />
            Отправить заявку
          </>
        )}
      </button>
    </form>
  );
}