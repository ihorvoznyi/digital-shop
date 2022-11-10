import './Order.scss';
import React, { FormEvent, Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { cartStore } from '../../store';
import { Contact, OrderItem, Shipping } from './components';
import Format from '../../utils/Format';
import { orderStore } from '../../store/order/Order';

const Order = () => {
  const navigate = useNavigate();

  const items = [...cartStore.cart];

  const { format, convertToDollar } = Format;

  useEffect(() => {
    if (!items.length) navigate('/');
  }, [items]);

  const totalPrice = items.reduce((cur, prev) => cur + prev.product.price * prev.quantity, 0);

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    const order = items.map((item) => {
      return {
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    orderStore.createOrder(order)
              .then(() => cartStore.clear())
              .catch((status) => console.log(status));
  };

  return (
    <div className='order-page'>
      <div className='order-page__container'>
        <div className='order-page__contact-info'>
          <form onSubmit={handleSubmit} className='order-page__contact-form'>
            <Contact />
            <Shipping />

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
