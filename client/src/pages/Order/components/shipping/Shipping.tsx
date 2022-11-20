import React, { useState } from 'react';
import { observer } from "mobx-react-lite";

import { ShippingMethodEnum } from "./enums/ShippingMethodEnum";

import PostOfficeAddress from "./PostOfficeAddress";
import HomeAddress from "./HomeAddress";

import { generalStore } from "../../../../store";
import { orderStore } from "../../../../store/order/Order";

import './styles/Shipping.scss'

const METHOD_SECTION = 'methodSection';

const Shipping = () => {

  const [shippingMethod, setShippingMethod] = useState<ShippingMethodEnum>(ShippingMethodEnum.POST_OFFICE);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    generalStore.setOpenSection(METHOD_SECTION);
  }

  return (
    <div className='order-page__shipping-method'>
      <p className='order-page__shipping-title'>Доставка</p>

      <div className="order-page__select-method">
        <input
          type='text'
          placeholder='Метод доставки'
          className='order-page__shipping-input custom-input'
          value={shippingMethod}
          onClick={(e: any) => handleOpen(e)}
          onChange={(e: any) => orderStore.setData('method', e.target.value)}
        />

        <ul
          className={`order-page__methods custom-dropdown
          ${generalStore.openSection === METHOD_SECTION
            ? 'open'
            : 'hide'}`}
        >
          <li className='order-page__method' onClick={() => setShippingMethod(ShippingMethodEnum.POST_OFFICE)}>
            {ShippingMethodEnum.POST_OFFICE}
          </li>

          <li className='order-page__method' onClick={() => setShippingMethod(ShippingMethodEnum.HOME)}>
            {ShippingMethodEnum.HOME}
          </li>
        </ul>
      </div>
      {shippingMethod === ShippingMethodEnum.POST_OFFICE ? (<PostOfficeAddress/>) : (<HomeAddress/>)}
    </div>
  );
};

export default observer(Shipping);
