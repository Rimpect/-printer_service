import React from 'react';
import mockData from '../data/mockData.json';

const UserList = () => {
  const mockUsers = mockData.users;

  return (
    <div>
      <h2>Список пользователей</h2>
      <ul>
        {mockUsers.map((user) => (
          <li key={user.id}>
            {user.username} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;