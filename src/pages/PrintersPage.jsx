import React from 'react';
import PrinterList from '../components/PrinterList';

const PrintersPage = () => {
  const printers = [
    { id: 1, model: 'HP LaserJet', serialNumber: '12345', location: 'Кабинет 101', status: 'Работает' },
    { id: 2, model: 'Canon PIXMA', serialNumber: '67890', location: 'Кабинет 202', status: 'Требуется заправка' },
  ];

  return (
    <div>
      <h1>Принтеры</h1>
      <PrinterList printers={printers} />
    </div>
  );
};

export default PrintersPage;