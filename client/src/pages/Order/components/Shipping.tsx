import React from 'react';
import './styles/Shipping.scss'

const Shipping = () => {
  return (
    <div className='order-page__shipping'>
      <p className='order-page__shipping-title'>Доставка (Нова Пошта)</p>
      <form className="order-page__form-block">
        <input type='text' placeholder='Місто'/>
        <input type='text' placeholder='Введіть номер, або адресу відділення'/>
      </form>
    </div>
  );
};

export default Shipping;
