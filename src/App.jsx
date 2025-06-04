import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { UserDashboard } from "./components/UserDashboard";
import { ServiceDashboard } from "./components/ServiceDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { ErrorModal } from "./components/ErrorModal"; // Новый компонент для модального окна
import {
  Login,
  logout,
  fetchCurrentUser,
  fetchPrinters,
  getAllRequests,
  getAllUsers,
  createServiceRequest,
} from "./api/api";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [printers, setPrinters] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Состояние для ошибки

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const currentUser = await fetchCurrentUser();
          setUser(currentUser);
          setView(currentUser.role);
        }
      } catch (error) {
        console.error("Ошибка проверки авторизации:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setError("Сессия истекла. Пожалуйста, войдите снова.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (login, password) => {
    try {
      setIsLoading(true);
      const data = await Login(login, password);

      // Сохраняем токены
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);

      setUser(data.user);
      setView(data.user.role);
    } catch (error) {
      setError(error.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      setUser(null);
      setView("login");
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
      setError(error.message || "Ошибка при создании заявки");
    }
  };

  const closeErrorModal = () => {
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (view === "login") {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        {error && <ErrorModal message={error} onClose={closeErrorModal} />}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {view === "user" && (
          <UserDashboard
            printers={printers}
            onRequestSubmit={handleRequestSubmit}
          />
        )}
        {view === "Service" && (
          <ServiceDashboard
            printers={printers}
            requests={requests}
            onRequestSubmit={handleRequestSubmit}
          />
        )}
        {view === "admin" && (
          <AdminDashboard
            printers={printers}
            user={user}
            onRequestSubmit={handleRequestSubmit}
            requests={requests}
          />
        )}
      </main>
      <Footer />
      {error && <ErrorModal message={error} onClose={closeErrorModal} />}
    </div>
  );
}

export default App;
