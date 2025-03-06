import React from 'react';
import mockData from '../data/mockData.json'; 

const PrinterList = () => {
  const mockPrinters = mockData.printers;

  return (
    <div>
      <h2>Список принтеров</h2>
      <ul>
        {mockPrinters.map((printer) => (
          <li key={printer.id}>
            {printer.model} - {printer.location} ({printer.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrinterList;