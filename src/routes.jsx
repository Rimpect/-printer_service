import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import DeaneryPage from './pages/DeaneryPage';
import ServicePage from './pages/ServicePage';
import LoginPage from './pages/LoginPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/deanery" element={<DeaneryPage />} />
      <Route path="/service" element={<ServicePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default RoutesComponent;