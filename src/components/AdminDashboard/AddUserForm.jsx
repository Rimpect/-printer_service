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
} from "@fortawesome/free-solid-svg-icons";
import { registerUser, checkAvailability } from "../../api/api";

export function AddUserForm({ onRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    patronymic: "",
    login: "",
    email: "",
    phone: "",
    role: "",
    post: "",
    placeOfWork: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availability, setAvailability] = useState({
    login: { available: null, checking: false },
    email: { available: null, checking: false },
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Очищаем ошибку при изменении поля
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Сначала проверяем доступность логина/email
      const availability = await checkAvailability({
        login: formData.login,
        email: formData.email,
      });

      // 2. Проверяем результаты availability
      if (!availability.loginAvailable || !availability.emailAvailable) {
        const errors = {};
        if (!availability.loginAvailable) errors.login = "Логин уже занят";
        if (!availability.emailAvailable) errors.email = "Email уже занят";
        setFormErrors(errors);
        return;
      }

      // 3. Если проверка пройдена, регистрируем пользователя
      const user = await registerUser({
        ...formData,
        confirmPassword: undefined, // Удаляем confirmPassword из данных
      });

      // 4. Обработка успешной регистрации
      if (onRegister) onRegister(user);

      // 5. Сброс формы
      setFormData({
        name: "",
        surname: "",
        patronymic: "",
        login: "",
        email: "",
        phone: "",
        role: "",
        post: "",
        placeOfWork: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setFormErrors({ form: error.message });
    }
  };

  // Проверка доступности логина
  // useEffect(() => {
  //   if (formData.login.length < 3) {
  //     setAvailability((prev) => ({
  //       ...prev,
  //       login: { available: null, checking: false },
  //     }));
  //     return;
  //   }

  //   const timer = setTimeout(async () => {
  //     setAvailability((prev) => ({
  //       ...prev,
  //       login: { ...prev.login, checking: true },
  //     }));
  //     try {
  //       const response = await checkAvailability({ login: formData.login });
  //       setAvailability((prev) => ({
  //         ...prev,
  //         login: { available: response.loginAvailable, checking: false },
  //       }));
  //     } catch (error) {
  //       console.error("Login check error:", error);
  //       setAvailability((prev) => ({
  //         ...prev,
  //         login: { available: null, checking: false },
  //       }));
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [formData.login]);

  // Проверка доступности email
  // useEffect(() => {
  //   if (!formData.email.includes("@")) {
  //     setAvailability((prev) => ({
  //       ...prev,
  //       email: { available: null, checking: false },
  //     }));
  //     return;
  //   }

  //   const timer = setTimeout(async () => {
  //     setAvailability((prev) => ({
  //       ...prev,
  //       email: { ...prev.email, checking: true },
  //     }));
  //     try {
  //       const response = await checkAvailability({ email: formData.email });
  //       setAvailability((prev) => ({
  //         ...prev,
  //         email: { available: response.emailAvailable, checking: false },
  //       }));
  //     } catch (error) {
  //       console.error("Email check error:", error);
  //       setAvailability((prev) => ({
  //         ...prev,
  //         email: { available: null, checking: false },
  //       }));
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [formData.email]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Имя */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUser} />
          Имя*
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
            formErrors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          required
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
      </div>

      {/* Фамилия */}
      <div>
        <label
          htmlFor="surname"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUser} />
          Фамилия*
        </label>
        <input
          type="text"
          id="surname"
          value={formData.surname}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
            formErrors.surname
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          required
        />
        {formErrors.surname && (
          <p className="mt-1 text-sm text-red-600">{formErrors.surname}</p>
        )}
      </div>

      {/* Отчество */}
      <div>
        <label
          htmlFor="patronymic"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUser} />
          Отчество
        </label>
        <input
          type="text"
          id="patronymic"
          value={formData.patronymic}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Логин */}
      <div>
        <label
          htmlFor="login"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUser} />
          Логин*
        </label>
        <div className="relative">
          <input
            type="text"
            id="login"
            value={formData.login}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
              formErrors.login || availability.login.available === false
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          <div className="absolute right-3 top-2.5">
            {getStatusIcon("login")}
          </div>
        </div>
        {formErrors.login && (
          <p className="mt-1 text-sm text-red-600">{formErrors.login}</p>
        )}
        {formData.login.length > 0 && formData.login.length < 3 && (
          <p className="mt-1 text-sm text-yellow-600">Минимум 3 символа</p>
        )}
        {availability.login.available === false && (
          <p className="mt-1 text-sm text-red-600">Этот логин уже занят</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faEnvelope} />
          Email*
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
              formErrors.email || availability.email.available === false
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          <div className="absolute right-3 top-2.5">
            {getStatusIcon("email")}
          </div>
        </div>
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
        )}
        {availability.email.available === false && (
          <p className="mt-1 text-sm text-red-600">Этот email уже занят</p>
        )}
      </div>

      {/* Телефон */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPhone} />
          Телефон
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Роль */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUsers} />
          Роль*
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
            formErrors.role
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          required
        >
          <option value="">Выберите роль</option>
          <option value="user">Сотрудник деканата</option>
          <option value="Service">Работник сервиса</option>
          <option value="admin">Администратор</option>
        </select>
        {formErrors.role && (
          <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
        )}
      </div>

      {/* Должность */}
      <div>
        <label
          htmlFor="post"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUsers} />
          Должность
        </label>
        <input
          type="text"
          id="post"
          value={formData.post}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Место работы */}
      <div>
        <label
          htmlFor="placeOfWork"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faBriefcase} />
          Место работы
        </label>
        <input
          type="text"
          id="placeOfWork"
          value={formData.placeOfWork}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Пароль */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faLock} />
          Пароль*
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
              formErrors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
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
        {formErrors.password && (
          <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
        )}
      </div>

      {/* Подтверждение пароля */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faLock} />
          Подтвердите пароль*
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
              formErrors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {formErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {formErrors.confirmPassword}
          </p>
        )}
      </div>

      {/* Общая ошибка формы */}
      {formErrors.form && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {formErrors.form}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        Зарегистрировать
        <FontAwesomeIcon icon={faSignInAlt} />
      </button>
    </form>
  );
}
