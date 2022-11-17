import React, { FC } from 'react';

import { toPhoneNumber } from "../../../../utils/toPhoneNumber";
import { IUser } from "../../../../store/user/interfaces";

import './styles/PersonalMain.scss';

interface PropsType {
  userInfo: IUser
}

const PersonalMain: FC<PropsType> = ({ userInfo }) => {
  const { phoneNumber, email,  } = userInfo;

  return (
    <div className='cabinet-personal__info'>
      <div className='cabinet-personal__row'>
        <p>Ім'я та Прізвище:</p>
        <p>Ігор Возний</p>
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
        <p>{email}</p>
      </div>

      <div className='cabinet-personal__row'>
        <p>E-mail:</p>
        <p>{email}</p>
      </div>

    </div>
  );
};

export default PersonalMain;