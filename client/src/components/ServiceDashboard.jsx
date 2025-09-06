import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faListAlt, faInbox } from "@fortawesome/free-solid-svg-icons";
import { RepairRequest } from "./ServiceDashboard/RepairRequest";
import { UsersRequest } from "./ServiceDashboard/UsersRequest";
import {
  getOpenRequests,
  closeServiceRequest,
  updateRequestStatus,
  updateServiceCenter,
  fetchCurrentUser,
  getAssignedRequests,
} from "../api/api";
import { Modal } from "./Modal";

export function ServiceDashboard() {
  const [activeTab, setActiveTab] = useState("openRequests");
  const [openRequests, setOpenRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Загрузка текущего пользователя при монтировании
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
        showModal(
          "Ошибка",
          "Не удалось загрузить данные пользователя",
          "error"
        );
      }
    };
    loadUser();
  }, []);

  // Загрузка заявок
  useEffect(() => {
    if (currentUser) {
      fetchOpenRequests();
      fetchMyRequests();
    }
  }, [currentUser]);

  const showModal = (title, message, type = "info") => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const fetchOpenRequests = async () => {
    try {
      const requests = await getOpenRequests();
      setOpenRequests(requests);
    } catch (error) {
      console.error("Error fetching open requests:", error);
      showModal("Ошибка", "Не удалось загрузить открытые заявки", "error");
    }
  };

  const fetchMyRequests = async () => {
    try {
      const requests = await getAssignedRequests();
      setMyRequests(requests);
    } catch (error) {
      console.error("Ошибка загрузки назначенных заявок:", error);
      showModal("Ошибка", "Не удалось загрузить ваши заявки", "error");
    }
  };

  const handleTakeRequest = async (requestId) => {
    try {
      await updateRequestStatus(requestId, "in_progress");

      await updateServiceCenter(requestId, currentUser.id);

      await Promise.all([fetchOpenRequests(), fetchMyRequests()]);

      showModal("Успех", "Заявка взята в работу", "success");
    } catch (error) {
      console.error("Error taking request:", error);
      showModal(
        "Ошибка",
        `Ошибка при взятии заявки: ${error.message}`,
        "error"
      );
    }
  };

  const handleCloseRequest = async (e) => {
    e.preventDefault();
    try {
      await closeServiceRequest(selectedRequest, repairCost, workDescription);
      setSelectedRequest("");
      setRepairCost("");
      setWorkDescription("");
      fetchMyRequests();
      showModal("Успех", "Заявка успешно закрыта", "success");
    } catch (error) {
      console.error("Error closing request:", error);
      showModal("Ошибка", "Ошибка при закрытии заявки", "error");
    }
  };

  return (
    <div className="service-dashboard">
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "openRequests"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("openRequests")}
        >
          <FontAwesomeIcon icon={faInbox} />
          Открытые заявки ({openRequests.length})
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === "myRequests"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("myRequests")}
        >
          <FontAwesomeIcon icon={faListAlt} />
          Принятые в работу заявки ({myRequests.length})
        </button>
      </div>

      {activeTab === "openRequests" && (
        <UsersRequest
          openRequests={openRequests}
          onTakeRequest={handleTakeRequest}
        />
      )}

      {activeTab === "myRequests" && (
        <RepairRequest
          requests={myRequests}
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          repairCost={repairCost}
          setRepairCost={setRepairCost}
          workDescription={workDescription}
          setWorkDescription={setWorkDescription}
          handleSubmit={handleCloseRequest}
        />
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        {modal.message}
      </Modal>
    </div>
  );
}
