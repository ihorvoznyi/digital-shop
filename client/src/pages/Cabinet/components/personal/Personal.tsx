import { useState } from 'react';

import { PersonalMain, PersonalEdit } from '../index';

import { userStore } from '../../../../store';

import { IPersonal } from './IPersonal';
import { Validator } from '../../../../utils';

import { updateUser } from '../../../../store/user/services/UserService';

import './styles/Personal.scss';

const Personal = () => {
  const userInfo = userStore.user;

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const isValidEmail = Validator.validateEmail(personal.email);
    const isValidPhone = Validator.validatePhone(personal.phoneNumber);

    const isValid = isValidEmail && isValidPhone;

    if (!isValid) return;

    updateUser(personal).then(() => setIsEditing(false));
  }

  const [personal, setPersonal] = useState<IPersonal>({
    name: userInfo.name,
    email: userInfo.email,
    phoneNumber: userInfo.phoneNumber,
  });

  const handleChange = (property: string, value: string) => {
    setPersonal((prev) => ({ ...prev, [property]: value }));
  }

  return (
    <div className='cabinet-personal'>
      <div className='cabinet-personal__container'>
        <h2 className='cabinet-personal__title'>
          Особиста Інформація
        </h2>

        {isEditing
          ? <PersonalEdit userInfo={userInfo} onChange={handleChange}/>
          : <PersonalMain userInfo={userInfo} />
        }

        {isEditing ? (
          <div className='cabinet-personal__editing-buttons'>
            <div
              className='cabinet-personal__editing-btn cabinet-personal__editing-btn_save'
              onClick={() => handleSave()}
            >
              <span>Зберегти</span>
            </div>

            <div
              className='cabinet-personal__editing-btn cabinet-personal__editing-btn_cancel'
              onClick={() => setIsEditing(false)}
            >
              <span>Відмінити</span>
            </div>
          </div>
        ) : (
          <div className='cabinet-personal__change-info' onClick={() => setIsEditing(true)}>
            <span>Редагувати</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Personal;
