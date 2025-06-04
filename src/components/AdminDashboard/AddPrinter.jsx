import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faUser,
  faLock,
  faPhone,
  faEnvelope,
  faBriefcase,
  faUsers,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faExclamationCircle,
  faTimes,
  faLocationDot,
  faPrint,

  
} from "@fortawesome/free-solid-svg-icons";
import { registerPrinter } from "../../api/api";

export function AddPrinter({ onRegister }) {
  // Состояния формы
  const [formData, setFormData] = useState({
    model: "",
    location: "",
  });

  // Ошибки формы
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Состояния модального окна
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });

  // Проверка требований к паролю

  // Валидация всей формы
  const validateForm = () => {
    const errors = {};

    // Проверка обязательных полей
    if (!formData.model.trim()) errors.model = "Имя обязательно";
    if (!formData.location.trim()) errors.location = "Фамилия обязательна";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Сброс ошибки при изменении поля
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Регистрация пользователя
      const printer = await registerPrinter(formData);

      // Показ модального окна об успехе
      setModalContent({
        title: "Успешная регистрация",
        message: "Принтер успешно добавлен в базу данных!",
        type: "success",
      });
      setShowModal(true);

      // Сброс формы
      setFormData({
        model: "",
        location: "",
      });
      setFormErrors({});
    } catch (error) {
      // Показ модального окна об ошибке
      setModalContent({
        title: "Ошибка регистрации",
        message: error.message || "Произошла ошибка при регистрации",
        type: "error",
      });
      setShowModal(true);
      setFormErrors({
        form: error.message || "Произошла ошибка при регистрации",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Иконка статуса проверки доступности
  const getStatusIcon = (field) => {
    if (availability[field].checking) {
      return (
        <FontAwesomeIcon icon={faSpinner} spin className="ml-2 text-gray-500" />
      );
    }
    if (availability[field].available === true) {
      return (
        <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-green-500" />
      );
    }
    if (availability[field].available === false) {
      return (
        <FontAwesomeIcon icon={faTimesCircle} className="ml-2 text-red-500" />
      );
    }
    return null;
  };

  // Компонент модального окна
  const Modal = ({ isOpen, onClose, title, children, type = "info" }) => {
    if (!isOpen) return null;

    const typeClasses = {
      info: "bg-blue-100 border-blue-400 text-blue-700",
      success: "bg-green-100 border-green-400 text-green-700",
      warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
      error: "bg-red-100 border-red-400 text-red-700",
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className={`border-l-4 rounded-lg shadow-lg bg-white w-full max-w-md ${typeClasses[type]}`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="py-2">{children}</div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {/* Поле model */}
        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPrint} />
            Модель*
          </label>
          <input
            type="text"
            id="model"
            value={formData.model}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
              formErrors.model
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          {formErrors.model && (
            <p className="mt-1 text-sm text-red-600">{formErrors.model}</p>
          )}
        </div>

        {/* Поле location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faLocationDot} />
            Местонахождение*
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
              formErrors.location
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          {formErrors.location && (
            <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
          )}
        </div>

        {/* Общая ошибка формы */}
        {formErrors.form && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {formErrors.form}
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              Обработка...
            </>
          ) : (
            <>
              Зарегистрировать
              <FontAwesomeIcon icon={faSignInAlt} />
            </>
          )}
        </button>
      </form>

      {/* Модальное окно */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        type={modalContent.type}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </>
  );
}
