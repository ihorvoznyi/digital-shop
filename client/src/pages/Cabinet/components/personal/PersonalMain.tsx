import React, { FC } from 'react';

import { toPhoneNumber } from "../../../../utils/toPhoneNumber";
import { IUser } from "../../../../store/user/interfaces";

import './styles/PersonalMain.scss';

interface PropsType {
  userInfo: IUser
}

const PersonalMain: FC<PropsType> = ({ userInfo }) => {
  const { phoneNumber, email, name, address } = userInfo;
  const { city, home, postOffice } = address;

  return (
    <div className='cabinet-personal__info'>
      <div className='cabinet-personal__row'>
        <p>Ім'я та Прізвище:</p>
        <p>{name ? name : 'Не вказано'}</p>
      </div>

      <div className='cabinet-personal__row'>
        <p>Номер телефону:</p>
        <p>{toPhoneNumber(phoneNumber)}</p>
      </div>

      <div className='cabinet-personal__row'>
        <p>E-mail:</p>
        <p>{email}</p>
      </div>

      <div className='cabinet-personal__row'>
        <p>Місто:</p>
        <p>{city ? city : 'Не вказано'}</p>
      </div>

      <div className='cabinet-personal__row'>
        <p>Дом. Адреса:</p>
        <p>{home ? home : 'Не вказано'}</p>
      </div>

      <div className='cabinet-personal__row'>
        <p>Склад Нової Пошти:</p>
        <p>{postOffice ? postOffice : 'Не вказано'}</p>
      </div>
    </div>
  );
};

export default PersonalMain;