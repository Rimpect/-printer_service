import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser, faLock, faEye, faEyeSlash  } from '@fortawesome/free-solid-svg-icons';

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faSignInAlt} />
            Вход в систему
          </h2>
          <p className="text-gray-600">Авторизуйтесь для доступа к системе учёта принтеров</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            Войти
            <FontAwesomeIcon icon={faSignInAlt} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Если у вас нет доступа, обратитесь к администратору</p>
        </div>
      </div>
    </div>
  );
}