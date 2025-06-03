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

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availability, setAvailability] = useState({
    login: { available: null, checking: false },
    email: { available: null, checking: false },
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>_]/.test(password),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.name.trim()) errors.name = "Имя обязательно";
    if (!formData.surname.trim()) errors.surname = "Фамилия обязательна";
    if (!formData.login.trim()) errors.login = "Логин обязателен";
    if (!formData.email.trim()) errors.email = "Email обязателен";
    if (!formData.role) errors.role = "Роль обязательна";
    if (!formData.password) errors.password = "Пароль обязателен";
    if (!formData.confirmPassword)
      errors.confirmPassword = "Подтверждение пароля обязательно";

    // Password validation
    if (formData.password && !validatePassword(formData.password)) {
      errors.password = "Пароль не соответствует требованиям";
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    // Login length validation
    if (formData.login.length > 0 && formData.login.length < 3) {
      errors.login = "Логин должен содержать минимум 3 символа";
    }

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Некорректный формат email";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when field changes
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }

    // Validate password in real-time
    if (id === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Check availability
      const availabilityCheck = await checkAvailability({
        login: formData.login,
        email: formData.email,
      });

      const errors = {};
      if (!availabilityCheck.loginAvailable) errors.login = "Логин уже занят";
      if (!availabilityCheck.emailAvailable) errors.email = "Email уже занят";

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Register user
      const user = await registerUser(formData);
      if (onRegister) onRegister(user);

      // Reset form
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
      setFormErrors({});
    } catch (error) {
      setFormErrors({
        form: error.message || "Произошла ошибка при регистрации",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check login availability
  useEffect(() => {
    if (formData.login.length < 3) {
      setAvailability((prev) => ({
        ...prev,
        login: { available: null, checking: false },
      }));
      return;
    }

    const timer = setTimeout(async () => {
      setAvailability((prev) => ({
        ...prev,
        login: { ...prev.login, checking: true },
      }));
      try {
        const response = await checkAvailability({ login: formData.login });
        setAvailability((prev) => ({
          ...prev,
          login: { available: response.loginAvailable, checking: false },
        }));
      } catch (error) {
        console.error("Login check error:", error);
        setAvailability((prev) => ({
          ...prev,
          login: { available: null, checking: false },
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.login]);

  // Check email availability
  useEffect(() => {
    if (!formData.email.includes("@")) {
      setAvailability((prev) => ({
        ...prev,
        email: { available: null, checking: false },
      }));
      return;
    }

    const timer = setTimeout(async () => {
      setAvailability((prev) => ({
        ...prev,
        email: { ...prev.email, checking: true },
      }));
      try {
        const response = await checkAvailability({ email: formData.email });
        setAvailability((prev) => ({
          ...prev,
          email: { available: response.emailAvailable, checking: false },
        }));
      } catch (error) {
        console.error("Email check error:", error);
        setAvailability((prev) => ({
          ...prev,
          email: { available: null, checking: false },
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

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

  const getPasswordRequirementIcon = (met) => (
    <FontAwesomeIcon
      icon={met ? faCheckCircle : faExclamationCircle}
      className={`ml-2 ${met ? "text-green-500" : "text-gray-400"}`}
    />
  );

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
        {formData.login.length > 0 &&
          formData.login.length < 3 &&
          !formErrors.login && (
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

        {/* Password requirements */}
        <div className="mt-2 text-sm text-gray-600">
          <p className="font-medium">Требования к паролю:</p>
          <ul className="space-y-1">
            <li className="flex items-center">
              {getPasswordRequirementIcon(passwordRequirements.length)}
              <span>Минимум 8 символов</span>
            </li>
            <li className="flex items-center">
              {getPasswordRequirementIcon(passwordRequirements.upperCase)}
              <span>Хотя бы одна заглавная буква (A-Z)</span>
            </li>
            <li className="flex items-center">
              {getPasswordRequirementIcon(passwordRequirements.lowerCase)}
              <span>Хотя бы одна строчная буква (a-z)</span>
            </li>
            <li className="flex items-center">
              {getPasswordRequirementIcon(passwordRequirements.number)}
              <span>Хотя бы одна цифра (0-9)</span>
            </li>
            <li className="flex items-center">
              {getPasswordRequirementIcon(passwordRequirements.specialChar)}
              <span>Хотя бы один специальный символ (!@#$%^&* и т.д.)</span>
            </li>
          </ul>
        </div>
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
  );
}
