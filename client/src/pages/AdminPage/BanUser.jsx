import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBan } from '@fortawesome/free-solid-svg-icons';

export function BanUser({ users = [], onBanUser }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [banReason, setBanReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser && banReason) {
      onBanUser(selectedUser, banReason);
      setSelectedUser('');
      setBanReason('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faBan} />
        Блокировка пользователя
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} />
            Выберите пользователя
          </label>
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Выберите пользователя --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="banReason" className="block text-sm font-medium text-gray-700 mb-2">
            Причина блокировки
          </label>
          <textarea
            id="banReason"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          Заблокировать пользователя
        </button>
      </form>
    </div>
  );
}