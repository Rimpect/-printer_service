import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { UserDashboard } from "./components/UserDashboard";
import { ServiceDashboard } from "./components/ServiceDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { BanUser } from "./components/AdminDashboard/BanUser";
import {
  Login,
  logout,
  fetchCurrentUser,
  fetchPrinters,
  getAllRequests,
  getAllUsers,
} from "./api/api";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [printers, setPrinters] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [adminView, setAdminView] = useState("main");
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const currentUser = await fetchCurrentUser();
          setUser(currentUser);
          setView(currentUser.role);

          // Загружаем дополнительные данные
          const [printersData, requestsData, usersData] = await Promise.all([
            fetchPrinters(),
            getAllRequests(),
            getAllUsers(),
          ]);

          setPrinters(printersData);
          setRequests(requestsData);
          setUsers(usersData);
          setBannedUsers(usersData.filter((u) => u.isBanned).map((u) => u.id));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
const handleLogin = async (login, password) => {
  try {
    const data = await Login(login, password); // Передаём только логин и пароль
    localStorage.setItem('accessToken', data.tokens.accessToken);
    setUser(data.user);
    setView(data.user.role);
  } catch (error) {
    alert(error.message);
  }
};
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setView("login");
      setAdminView("main");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const handleBanUser = async (userId, reason) => {
    try {
      await banUser(userId, reason);
      setBannedUsers([...bannedUsers, userId]);
      alert(`Пользователь с ID ${userId} заблокирован. Причина: ${reason}`);
    } catch (error) {
      alert(error.message || "Ошибка при блокировке пользователя");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await unbanUser(userId);
      setBannedUsers(bannedUsers.filter((id) => id !== userId));
      alert(`Пользователь с ID ${userId} разблокирован`);
    } catch (error) {
      alert(error.message || "Ошибка при разблокировке пользователя");
    }
  };

  const handleRequestSubmit = async (printerId, problem) => {
    try {
      const newRequest = await createServiceRequest({
        printerId,
        problem,
        userId: user.id,
      });
      setRequests([...requests, newRequest]);
    } catch (error) {
      alert(error.message || "Ошибка при создании заявки");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (view === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {view === "user" && (
          <UserDashboard
            printers={printers}
            onRequestSubmit={handleRequestSubmit}
            userRequests={requests.filter((r) => r.userId === user.id)}
          />
        )}
        {view === "service" && (
          <ServiceDashboard
            printers={printers}
            requests={requests}
            onRequestSubmit={handleRequestSubmit}
          />
        )}
        {view === "admin" && (
          <>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setAdminView("main")}
                className={`px-4 py-2 rounded ${
                  adminView === "main"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Основная панель
              </button>
              <button
                onClick={() => setAdminView("ban")}
                className={`px-4 py-2 rounded ${
                  adminView === "ban" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Управление пользователями
              </button>
            </div>

            {adminView === "main" && (
              <AdminDashboard
                printers={printers}
                user={user}
                onRequestSubmit={handleRequestSubmit}
                requests={requests}
              />
            )}

            {adminView === "ban" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BanUser
                  users={users.filter((u) => u.id !== user.id && !u.isBanned)}
                  onBanUser={handleBanUser}
                />

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">
                    Заблокированные пользователи
                  </h3>
                  {bannedUsers.length === 0 ? (
                    <p>Нет заблокированных пользователей</p>
                  ) : (
                    <ul className="space-y-2">
                      {bannedUsers.map((userId) => {
                        const bannedUser = users.find((u) => u.id === userId);
                        return (
                          <li
                            key={userId}
                            className="flex justify-between items-center p-2 bg-gray-100 rounded"
                          >
                            <span>
                              {bannedUser?.fullName ||
                                "Неизвестный пользователь"}{" "}
                              (ID: {userId})
                            </span>
                            <button
                              onClick={() => handleUnbanUser(userId)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Разблокировать
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
