import { observer } from 'mobx-react-lite';
import { FC, useState, FormEvent, useCallback } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';
import { userStore } from '../../../../store';

import { IAddress, IUser } from "../../../../store/user/interfaces";
import { checkIsAvailable } from '../../../../store/user/services/UserService';

import { toPhoneNumber, Validator } from '../../../../utils';

import './styles/PersonalEdit.scss';

interface PropsType {
  userInfo: IUser;
  onChange: (property: string, value: string) => void;
}

const PersonalEdit: FC<PropsType> = ({ userInfo, onChange }) => {

  const { email, phoneNumber, name } = userInfo;

  const [newName, setNewName] = useState<string>(name ? name : '');
  const [newEmail, setNewEmail] = useState<string>(email);
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(phoneNumber);

  const handleChange = (e: FormEvent<EventTarget>) => {
    const { value, name } = e.target as HTMLInputElement;

    const property = name as keyof IAddress;

    switch(name) {
      case 'email': {
        const isValid = Validator.validateEmail(value);

        if (value === email) return onChange(property, value);

        if (!isValid) return;

        checkIsAvailable(value).then((isAvailable) => {
          if (isAvailable) return onChange(property, value);
          else console.log(value, '-- Incorrect');  
        });

        break;
      }
      case 'phoneNumber': {
        const isValid = Validator.validatePhone(value);

        if (!isValid) return;

        onChange(property, value);

        break;
      }

      default: {
        onChange(property, value);
        return;
      }
    }
  }

  const debouceHandleChange = useCallback(useDebounce(handleChange, 200), []);

  return (
    <div className='cabinet-personal__edit'>
      <div className='cabinet-personal__row'>
        <p>Ім'я та Прізвище:</p>
        <input
          type='text'
          name='name'
          placeholder={"Ваше ім'я"}
          value={newName}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setNewName(value);
            debouceHandleChange(e);
          }}
        />
      </div>

      <div className='cabinet-personal__row'>
        <p>Номер телефону:</p>
        <input
          type='number'
          name='phoneNumber'
          placeholder={toPhoneNumber(phoneNumber)}
          value={newPhoneNumber}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setNewPhoneNumber(value);
            debouceHandleChange(e);
          }}
        />
      </div>

      <div className='cabinet-personal__row'>
        <p>E-mail:</p>
        <input
          type='text'
          name='email'
          placeholder={email}
          value={newEmail}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setNewEmail(value);
            debouceHandleChange(e);
          }}
        />
      </div>
    </div >
  );
};

export default observer(PersonalEdit);