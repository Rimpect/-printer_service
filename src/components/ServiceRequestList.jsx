import React from 'react';

const ServiceRequestList = ({ requests }) => {
  return (
    <div>
      {requests.map((request) => (
        <div key={request.id}>
          <h3>Заявка #{request.id}</h3>
          <p>Принтер: {request.printerId}</p>
          <p>Описание: {request.description}</p>
          <p>Статус: {request.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceRequestList;