import React from 'react';
import CartridgeCard from './CartridgeCard';

const CartridgeList = ({ cartridges }) => {
  return (
    <div>
      {cartridges.map((cartridge) => (
        <CartridgeCard key={cartridge.id} cartridge={cartridge} />
      ))}
    </div>
  );
};

export default CartridgeList;