import React from 'react';
import { BsCart3 } from 'react-icons/bs';

const Cart = () => {
  return (
    <div className='navbar__cart'>
      <div className='navbar__cart-icon'>
        <BsCart3 />
      </div>

      <span>Кошик</span>
    </div>
  );
};

export default Cart;
