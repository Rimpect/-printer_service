import { useState } from "react";
import { Modal } from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faHistory,
  faUserPlus,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../api/api";
import { AddUserForm } from "./AdminDashboard/AddUserForm";
import { GenerateReport } from "./AdminDashboard/GenerateReport";
import { NewRequest } from "./NewRequest";
import { MyRequests } from "./MyRequests";

export function AdminDashboard({
  printers = [],
  onRequestSubmit = () => {},
  userRequests = [],
}) {
  // Состояния для формы
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [activeTab, setActiveTab] = useState("newRequest");

  // Состояние для модального окна
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Функция для показа модального окна
  const showModal = (title, message, type = "info") => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверка заполнения полей
    if (!selectedPrinter) {
      showModal("Ошибка", "Пожалуйста, выберите принтер", "error");
      return;
    }

    if (!problemDescription.trim()) {
      showModal("Ошибка", "Пожалуйста, опишите проблему", "error");
      return;
    }

    onRequestSubmit(selectedPrinter, problemDescription);
    setSelectedPrinter("");
    setProblemDescription("");
    setActiveTab("myRequests");
    showModal("Успех", "Заявка успешно отправлена!", "success");
  };

  const safeUserRequests = Array.isArray(userRequests) ? userRequests : [];
  const safePrinters = Array.isArray(printers) ? printers : [];

  const tabs = [
    {
      id: "newRequest",
      icon: faPlusCircle,
      label: "Новая заявка",
    },
    {
      id: "myRequests",
      icon: faHistory,
      label: "Мои заявки",
    },
    {
      id: "AddUsers",
      icon: faUserPlus,
      label: "Регистрация пользователя",
    },
    {
      id: "GenerateReport",
      icon: faFile,
      label: "Отчет",
    },
  ];

  const handleRegister = async (userData) => {
    try {
      await registerUser(userData);
      showModal("Успех", "Пользователь успешно зарегистрирован!", "success");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      showModal("Ошибка", error.message || "Ошибка при регистрации", "error");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "newRequest":
        return (
          <NewRequest
            printers={safePrinters}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            problemDescription={problemDescription}
            setProblemDescription={setProblemDescription}
            handleSubmit={handleSubmit}
          />
        );
      case "myRequests":
        return <MyRequests userRequests={safeUserRequests} />;
      case "AddUsers":
        return <AddUserForm onRegister={handleRegister} />;
      case "GenerateReport":
        return <GenerateReport />;
      default:
        return (
          <NewRequest
            printers={safePrinters}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            problemDescription={problemDescription}
            setProblemDescription={setProblemDescription}
            handleSubmit={handleSubmit}
          />
        );
    }
  };

  return (
    <div className="user-dashboard p-2 sm:p-4">
      {/* Модальное окно */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        {modal.message}
      </Modal>

      {/* Панель вкладок */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Контент вкладок */}
      <div className="p-1 sm:p-0">{renderTabContent()}</div>
    </div>
  );
}
