import './Order.scss';
import { FormEvent, Fragment, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { cartStore, generalStore, userStore } from '../../store';
import { Contact, OrderItem, Shipping } from './components';
import Format from '../../utils/Format';
import { createOrder } from '../../store/order/OrderService';
import { IContact, IShipping } from '../../store/order/interfaces';

const Order = () => {
  const navigate = useNavigate();

  const items = [...cartStore.cart];

  const { name, email, phoneNumber } = userStore.user;

  const { format, convertToDollar } = Format;

  useEffect(() => {
    if (!items.length) navigate('/');
  }, [items]);

  const [userContact, setUserContact] = useState<IContact>({
    name: name ? name : '',
    email: email ? email : '',
    phoneNumber: phoneNumber ? phoneNumber : ''
  });

  const [shipping, setShipping] = useState<IShipping>({
    method: generalStore.shippingMethod,
    city: '',
    address: '',
  });

  const totalPrice = items.reduce((cur, prev) => cur + prev.product.price * prev.quantity, 0);

  const handleChangeContact = (property: string, value: string) => {
    const key = property as keyof IContact;
    setUserContact((prev) => ({...prev, [key]: value}));
  }

  const handleChangeShipping = (property: string, value: string) => {
    const key = property as keyof IShipping;
    setShipping((prev) => ({...prev, [key]: value}));
  }

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    const products = items.map((item) => {
      return {
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    createOrder({
      userId: userStore.user.id ? userStore.user.id : '',
      contact: userContact,
      shipping,
      products,
    }).then(() => cartStore.cart = []);
  };

  return (
    <div className='order-page'>
      <div className='order-page__container'>
        <div className='order-page__contact-info'>
          <form onSubmit={handleSubmit} className='order-page__contact-form'>
            <Contact 
              defaultValue={userContact} 
              onChange={(property: string, value: string) => handleChangeContact(property, value)}
            />
            <Shipping 
              onChange={(property: string, value: string) => handleChangeShipping(property, value)}
            />

            <button className='order-page__submit-btn'>
              <span>Оформити замовлення</span>
            </button>
          </form>
        </div>

        <div className='order-page__order'>
          <h2 className='order-page__order-title'>Оформити замовлення</h2>

          <ul className='order-page__products'>
            {items.map((item) => (
              <Fragment key={item.product.id}>
                <OrderItem product={item.product} quantity={item.quantity} />
                <div className='divider' />
              </Fragment>
            ))}
          </ul>

          <div className='order-page__total'>
            <p>Сума Вашого замовлення:</p>

            <div className='order-page__total-price'>
              <span>
                {format(totalPrice)} грн
              </span>

              <span>
                ({format(convertToDollar(totalPrice))} $)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Order);
