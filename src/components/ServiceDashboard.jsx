import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faListAlt, faInbox } from "@fortawesome/free-solid-svg-icons";
import { RepairRequest } from "./ServiceDashboard/RepairRequest";
import { UsersRequest } from "./ServiceDashboard/UsersRequest";
import {
  getOpenRequests,
  getAllRequests,
  closeServiceRequest,
  updateRequestStatus,
  updateServiceCenter,
  fetchCurrentUser,
  getAssignedRequests,
} from "../api/api";

export function ServiceDashboard() {
  const [activeTab, setActiveTab] = useState("openRequests");
  const [openRequests, setOpenRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Загрузка текущего пользователя при монтировании
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
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

  const fetchOpenRequests = async () => {
    try {
      const requests = await getOpenRequests();
      setOpenRequests(requests);
    } catch (error) {
      console.error("Error fetching open requests:", error);
      alert("Не удалось загрузить открытые заявки");
    }
  };
  const fetchMyRequests = async () => {
    try {
      const requests = await getAssignedRequests();
      setMyRequests(requests);
    } catch (error) {
      console.error("Ошибка загрузки назначенных заявок:", error);
      alert("Не удалось загрузить ваши заявки");
    }
  };
  const handleTakeRequest = async (requestId) => {
    try {
      // First update the status
      await updateRequestStatus(requestId, "in_progress");

      // Then assign to service center
      await updateServiceCenter(requestId, currentUser.id);

      // Refresh both lists
      await Promise.all([fetchOpenRequests(), fetchMyRequests()]);

      alert("Заявка взята в работу");
    } catch (error) {
      console.error("Error taking request:", error);
      alert(`Ошибка при взятии заявки: ${error.message}`);
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
      alert("Заявка успешно закрыта");
    } catch (error) {
      console.error("Error closing request:", error);
      alert("Ошибка при закрытии заявки");
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
          Мои заявки ({myRequests.length})
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
    </div>
  );
}
