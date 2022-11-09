import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { toPhoneNumber } from "../../../../utils/toPhoneNumber";
import { IUser } from "../../../../store/user/interfaces";

import './styles/PersonalMain.scss';

interface PropsType {
  userInfo: IUser
}

const PersonalMain: FC<PropsType> = ({ userInfo }) => {
  const { phoneNumber, email, name, addresses } = userInfo;

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
    </div>
  );
};

export default observer(PersonalMain);