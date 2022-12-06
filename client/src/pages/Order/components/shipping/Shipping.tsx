import React, { useState, FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ShippingMethodEnum } from './enums/ShippingMethodEnum';

import PostOfficeAddress from './PostOfficeAddress';
import HomeAddress from './HomeAddress';

import { generalStore } from '../../../../store';

import './styles/Shipping.scss'

const METHOD_SECTION = 'methodSection';

interface PropsType {
  onChange: (property: string, value: string) => void;
}

const Shipping: FC<PropsType> = ({ onChange }) => {

  const [shippingMethod, setShippingMethod] = useState<ShippingMethodEnum>(generalStore.shippingMethod);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    generalStore.setOpenSection(METHOD_SECTION);
  }

  const changeMethod = (method: ShippingMethodEnum) => {
    generalStore.shippingMethod = method;
    onChange('method', method);
    onChange('address', '');
    onChange('city', '');
  }

  return (
    <div className='order-page__shipping-method'>
      <p className='order-page__shipping-title'>Доставка</p>

      <div className='order-page__select-method'>
        <input
          type='text'
          placeholder='Метод доставки'
          className='order-page__shipping-input custom-input'
          value={shippingMethod}
          onClick={(e: any) => handleOpen(e)}
          onChange={(e: any) => { }}
        />

        <ul
          className={`order-page__methods custom-dropdown
          ${generalStore.openSection === METHOD_SECTION
              ? 'open'
              : 'hide'}`}
        >
          <li className='order-page__method' onClick={() => {
            changeMethod(ShippingMethodEnum.POST_OFFICE);
            setShippingMethod(ShippingMethodEnum.POST_OFFICE);
          }}>
            {ShippingMethodEnum.POST_OFFICE}
          </li>

          <li className='order-page__method' onClick={() => {
            changeMethod(ShippingMethodEnum.HOME);
            setShippingMethod(ShippingMethodEnum.HOME);
          }}>
            {ShippingMethodEnum.HOME}
          </li>
        </ul>
      </div>
      {shippingMethod === ShippingMethodEnum.POST_OFFICE
        ? (<PostOfficeAddress onChange={onChange}/>)
        : (<HomeAddress onChange={onChange}/>)
      }
    </div>
  );
};

export default observer(Shipping);
