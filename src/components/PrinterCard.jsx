import React from 'react';

const PrinterCard = ({ printer }) => {
  return (
    <div>
      <h3>{printer.model}</h3>
      <p>Серийный номер: {printer.serialNumber}</p>
      <p>Местоположение: {printer.location}</p>
      <p>Статус: {printer.status}</p>
    </div>
  );
};

export default PrinterCard;