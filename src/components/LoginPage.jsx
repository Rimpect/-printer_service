import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser, faLock } from '@fortawesome/free-solid-svg-icons';

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
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