import { observer } from 'mobx-react-lite';
import React, { FC, FormEvent, useState } from 'react';

import { orderStore, userStore } from '../../../../store';

import { Validator } from '../../../../utils';

import './Contact.scss';

const Contact = () => {

  const { email, name, phoneNumber } = userStore.user;

  const [contactName, setContactName] = useState<string>(name ? name : '');
  const [contactEmail, setContactEmail] = useState<string>(email);
  const [contactPhone, setContactPhone] = useState<string>(phoneNumber);

  const handleChange = (e: FormEvent<EventTarget>) => {
    const { value, name } = e.target as HTMLInputElement;
    
    if (name === 'phoneNumber') {
      const isValid = Validator.validatePhone(value);

      if (isValid) {
        orderStore.setOrderDetails(name, value);
      }

      return;
    }

    orderStore.setOrderDetails(name, value);
  }

  return (
    <div className='order-page__contact'>
      <p className='order-page__contact-title'>Контактна інформація</p>
      <div className='order-page__form-block'>
        <input 
          className='custom-input' 
          type="text"
          name='name' 
          placeholder="Ім'я та прізвище*" 
          value={contactName}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setContactName(value);
            handleChange(e);
          }}
          required
        />
        <input
          className='custom-input'
          type="text"
          placeholder="Номер телефону*"
          name='phoneNumber'
          inputMode='numeric'
          value={contactPhone}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setContactPhone(value);
            handleChange(e);
          }}
          required
        />
        <input 
          className='custom-input' 
          type="text"
          name='email'
          value={contactEmail}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setContactEmail(value);
            handleChange(e);
          }}
          placeholder="E-mail"
        />
      </div>
    </div>
  );
};

export default observer(Contact);
