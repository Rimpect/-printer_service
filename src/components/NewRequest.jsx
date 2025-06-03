import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faPrint,
  faExclamationTriangle,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { fetchPrinters, createServiceRequest } from "../api/api";
import { Modal } from "./Modal"; // Предполагается, что Modal находится в этом пути

export function NewRequest() {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        const data = await fetchPrinters();
        setPrinters(data);
      } catch (error) {
        console.error("Error loading printers:", error);
        setModal({
          isOpen: true,
          title: "Ошибка",
          message: "Не удалось загрузить список принтеров",
          type: "error",
        });
      }
    };
    loadPrinters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await createServiceRequest({
        printer_id: Number(selectedPrinter),
        problem_description: problemDescription,
      });

      setModal({
        isOpen: true,
        title: "Успех",
        message: "Заявка успешно создана!",
        type: "success",
      });

      setSelectedPrinter("");
      setProblemDescription("");
    } catch (error) {
      console.error("Полная ошибка создания заявки:", error);
      const errorMessage = error.message || "Ошибка при создании заявки";
      setError(errorMessage);
      setModal({
        isOpen: true,
        title: "Ошибка",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
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

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        {modal.message}
      </Modal>
    </>
  );
}
