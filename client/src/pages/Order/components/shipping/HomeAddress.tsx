import React from 'react';
import { observer } from "mobx-react-lite";

const HomeAddress = () => {
  return (
    <div className='order-page__post-office'>
      <input
        type='text'
        placeholder='Місто'
        className='order-page__shipping-input custom-input'
      />
      <input
        type='text'
        placeholder='Адрес доставки'
        className='order-page__shipping-input custom-input'
      />
    </div>
  );
};

export default observer(HomeAddress);
