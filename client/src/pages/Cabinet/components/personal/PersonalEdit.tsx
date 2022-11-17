import { observer } from 'mobx-react-lite';
import { FC, FormEvent, useCallback, useState, useEffect } from 'react';

import { Warehouses } from '../../../../components';

import { useDebounce } from '../../../../hooks/useDebounce';
import { shippingStore, userStore, generalStore } from '../../../../store';

import { IUser } from "../../../../store/user/interfaces";

import { toPhoneNumber, Validator } from '../../../../utils';

import './styles/PersonalEdit.scss';

interface PropsType {
  userInfo: IUser;
  onChange: (property: string, value: string) => void;
}

const PERSONAL_SECTION = 'personalSection';

const PersonalEdit: FC<PropsType> = ({ userInfo, onChange }) => {

  const { email, phoneNumber, name, address } = userInfo;
  const { home, city, postOffice } = address;

  const [newName, setNewName] = useState<string>(name);
  const [newEmail, setNewEmail] = useState<string>(email);
  const [newPhone, setNewPhone] = useState<string>(phoneNumber);
  const [newCity, setNewCity] = useState<string>(city);
  const [newHome, setNewHome] = useState<string>(home);
  const [newPostOffice, setNewPostOffice] = useState<string>(postOffice);

  const [activeWarehouses, setActiveWarehouses] = useState(shippingStore.warehouses);

  const handleSelect = (warehouse: string) => {
    setNewPostOffice(warehouse);
    onChange('postOffice', warehouse);
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    generalStore.setOpenSection(PERSONAL_SECTION);
  }

  const handleChange = (property: string, e: FormEvent<EventTarget>) => {
    const { value } = e.target as HTMLInputElement;
    property = property as keyof IUser;

    switch (property) {
      case 'email': {
        const isValid = Validator.validateEmail(value) && value !== email;

        if (isValid) {
          userStore.checkIsAvailable(value).then((isAvailable) => {
            if (isAvailable) return onChange(property, value);
            console.log('Email is not available');
          });
        }

        break;
      }

      case 'phoneNumber': {
        const isValid = Validator.validatePhone(value) && value !== phoneNumber;

        if (isValid) onChange(property, value);
        else console.log('phone number is invalid');

        break;
      }

      case 'city': {
        shippingStore.fetchWarehouses(value);
        onChange(property, value);
      }

      case 'postOffice': {
        const warehouses = shippingStore.getWarehouses();

        const findWarehouse = warehouses.filter((warehouse) => {
          return warehouse.toLowerCase().includes(value.toLowerCase());
        });
    
        setActiveWarehouses(findWarehouse);
        onChange(property, value);
      }

      default: {
        onChange(property, value);
        return;
      }
    }
  };

  const debounceChange = useCallback(useDebounce(handleChange, 200), []);

  useEffect(() => {
    shippingStore.fetchWarehouses(city);
  }, []);

  return (
    <div className='cabinet-personal__edit'>
      <div className='cabinet-personal__row'>
        <p>Ім'я та Прізвище:</p>
        <input
          type='text'
          placeholder={"Ваше ім'я"}
          value={newName}
          onChange={(e: FormEvent<EventTarget>) => {
            setNewName((e.target as HTMLInputElement).value);
            debounceChange('name', e);
          }}
        />
      </div>

      <div className='cabinet-personal__row'>
        <p>Номер телефону:</p>
        <input
          type='number'
          placeholder={toPhoneNumber(phoneNumber)}
          value={newPhone}
          onChange={(e: FormEvent<EventTarget>) => {
            setNewPhone((e.target as HTMLInputElement).value);
            debounceChange('phoneNumber', e)
          }}
        />
      </div>

      <div className='cabinet-personal__row'>
        <p>E-mail:</p>
        <input
          type='text'
          placeholder={email}
          value={newEmail}
          onChange={(e: FormEvent<EventTarget>) => {
            setNewEmail((e.target as HTMLInputElement).value);
            debounceChange('email', e);
          }}
        />
      </div>

      <div className='cabinet-personal__row'>
        <p>Місто:</p>
        <input
          type='text'
          placeholder={'Ваше місто'}
          value={newCity}
          onChange={(e: FormEvent<EventTarget>) => {
            setNewCity((e.target as HTMLInputElement).value);
            debounceChange('city', e);
          }}
        />
      </div>

      <div className='cabinet-personal__row'>
        <p>Дом. Адреса:</p>
        <input
          type='text'
          placeholder={'Ваша адреса'}
          value={newHome}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setNewHome(value);
            debounceChange('home', e);
          }}
        />
      </div>

      <div className='cabinet-personal__row'>
        <p>Нова Пошта:</p>
        <div className="cabinet-personal__warehouse-input">
          <input
            type='text'
            placeholder={'Адреса нової пошти'}
            value={newPostOffice}
            onClick={(e: any) => handleOpen(e)}
            onChange={(e: FormEvent<EventTarget>) => {
              const { value } = e.target as HTMLInputElement;

              setNewPostOffice(value);
              debounceChange('postOffice', e);
            }}
          />

          <Warehouses
            warehouses={activeWarehouses}
            section={PERSONAL_SECTION}
            onSelect={handleSelect}
            className='cabinet-personal__warehouses'
          />
        </div>
      </div>
    </div>
  );
};

export default observer(PersonalEdit);