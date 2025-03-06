import React from 'react';

const CartridgeCard = ({ cartridge }) => {
  return (
    <div>
      <h3>{cartridge.model}</h3>
      <p>Серийный номер: {cartridge.serialNumber}</p>
      <p>Статус: {cartridge.status}</p>
    </div>
  );
};

export default CartridgeCard;