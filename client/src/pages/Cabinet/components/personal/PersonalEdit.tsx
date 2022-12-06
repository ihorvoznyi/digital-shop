import { observer } from 'mobx-react-lite';
import { FC, useState, FormEvent, useCallback, useRef } from 'react';
import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs';

import { IAddress, IUser } from "../../../../store/user/interfaces";
import { checkIsAvailable } from '../../../../store/user/services/UserService';

import { Format, Validator, debounce } from '../../../../utils';

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

  const emailRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: FormEvent<EventTarget>) => {
    const { value, name } = e.target as HTMLInputElement;

    const property = name as keyof IAddress;

    switch(name) {
      case 'email': {
        const isValid = Validator.validateEmail(value);

        if (value === email) return onChange(property, value);

        if (isValid) {
          checkIsAvailable(value).then((isAvailable) => {
            if (isAvailable) {
              emailRef.current?.classList.remove('error');
  
              return onChange(property, value);
            }
            else emailRef.current?.classList.add('error');
          });
        } else {
          emailRef.current?.classList.add('error')
        }

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

  const debouceHandleChange = useCallback(debounce(handleChange, 200), []);

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
          placeholder={Format.toPhoneNumber(phoneNumber)}
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
          ref={emailRef}
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