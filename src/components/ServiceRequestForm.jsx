import React, { useState } from 'react';

const ServiceRequestForm = ({ onSubmit }) => {
  const [request, setRequest] = useState({
    printerId: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Принтер:
        <input
          type="text"
          value={request.printerId}
          onChange={(e) => setRequest({ ...request, printerId: e.target.value })}
        />
      </label>
      <label>
        Описание:
        <textarea
          value={request.description}
          onChange={(e) => setRequest({ ...request, description: e.target.value })}
        />
      </label>
      <button type="submit">Отправить заявку</button>
    </form>
  );
};

export default ServiceRequestForm;