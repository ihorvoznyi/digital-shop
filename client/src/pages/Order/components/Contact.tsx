import React from 'react';
import './styles/Contact.scss';

const Contact = () => {
  return (
    <div className='order-page__contact'>
      <p className='order-page__contact-title'>Контактна інформація</p>
      <div className='order-page__form-block'>
        <input className='custom-input' type="text" placeholder="Ім'я та прізвище*" required/>
        <input
          className='custom-input'
          type="text"
          placeholder="Номер телефону*"
          name='telephone'
          inputMode='numeric'
          required
        />
        <input className='custom-input' type="text" placeholder="E-mail"/>
      </div>
    </div>
  );
};

export default Contact;
