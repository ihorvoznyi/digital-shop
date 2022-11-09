import { FC, FormEvent, useEffect, useState } from 'react';
import { IContact } from '../../../store/order/interfaces';
import { orderStore } from '../../../store/order/Order';
import { Validator } from '../../../utils';
import './styles/Contact.scss';

interface PropsType {
  defaultValue: IContact;
  onChange: (property: string, value: string) => void;
}

const Contact: FC<PropsType> = ({ defaultValue, onChange }) => {
  const { name, email, phoneNumber } = defaultValue;

  const [defaultName, setDefaultName] = useState(name ? name : '');
  const [defaultEmail, setDefaultEmail] = useState(email ? email : '');
  const [defaultPhoneNumber, setDefaultPhoneNumber] = useState(phoneNumber ? phoneNumber : '');

  const handleChange = (e: FormEvent<EventTarget>) => {
    const { value, name } = e.target as HTMLInputElement;

    let isValid = true;

    if (name === 'phoneNumber') {
      isValid = Validator.validatePhone(value);
    }

    if (!isValid) return;
    
    onChange(name, value);
  };

  useEffect(() => {

  }, []);

  return (
    <div className='order-page__contact'>
      <p className='order-page__contact-title'>Контактна інформація</p>
      <div className='order-page__form-block'>
        <input 
          className='custom-input'
          type="text" 
          placeholder="Ім'я та прізвище*" 
          name="name"
          value={defaultName}
          onChange={(e: FormEvent<EventTarget>) => {
            const { value } = e.target as HTMLInputElement;
            setDefaultName((e.target as HTMLInputElement).value);
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
          value={defaultPhoneNumber}
          onChange={(e: FormEvent<EventTarget>) => {
            setDefaultPhoneNumber((e.target as HTMLInputElement).value);
            handleChange(e);
          }}
          required
        />
        <input 
          className='custom-input' 
          type="text" 
          placeholder="E-mail"
          name="email"
          value={defaultEmail}
          onChange={(e: FormEvent<EventTarget>) => {
            setDefaultEmail((e.target as HTMLInputElement).value);
            handleChange(e);
          }}
        />
      </div>
    </div>
  );
};

export default Contact;
