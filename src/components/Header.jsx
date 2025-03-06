// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/">Главная</Link>
        {user?.role === 'admin' && <Link to="/admin">Админ</Link>}
        {user?.role === 'deanery' && <Link to="/deanery">Деканат</Link>}
        {user?.role === 'service' && <Link to="/service">Сервис</Link>}
        {user ? (
          <button onClick={logout}>Выйти</button>
        ) : (
          <Link to="/login">Войти</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;