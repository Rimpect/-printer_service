import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export function LoginPage({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password) return;

    setIsLoading(true);
    try {
      await onLogin(login, password);
    } catch (error) {
      console.error("Login error:", error);
      setErrorModal({
        isOpen: true,
        message: error.message || "Неверный логин или пароль",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSignInAlt} />
            Вход в систему
          </h2>
          <p className="text-gray-600">
            Авторизуйтесь для доступа к системе учёта принтеров
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faUser} />
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faLock} />
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Вход..." : "Войти"}
            {!isLoading && <FontAwesomeIcon icon={faSignInAlt} />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Если у вас нет доступа, обратитесь к администратору</p>
        </div>
      </div>

      {/* Модальное окно ошибки */}
      {errorModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="text-red-500 text-xl"
                  />
                  <h3 className="text-xl font-bold text-gray-800">
                    Ошибка входа
                  </h3>
                </div>
                <button
                  onClick={closeErrorModal}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  &times;
                </button>
              </div>
              <p className="text-gray-700 mb-6">{errorModal.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeErrorModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
