import React, { Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { BsCart3 } from 'react-icons/bs';
import { cartStore } from '../../../../store';
import Format from '../../../../utils/Format';

import './styles/Cart.scss';
import { useNavigate } from 'react-router-dom';

const imageLink = 'https://jabko.ua/image/cache/catalog/products/2022/04/081823/iphone11-black-select-2019-124x124.jpg';

const Cart = () => {
  const navigate = useNavigate();
  const { format } = Format;
  const size = cartStore.cart.length;
  return (
    <div className='navbar__cart navbar__cart_dropdown'>
      <div className='navbar__cart-btn' onClick={() => navigate('/order-page')}>
        <div
          className={`navbar__cart-icon ${size ? 'navbar__cart-icon_not-empty' : ''}`}
          data-products={size ? size : ''}
        >
          <BsCart3 />
        </div>

        <span>Кошик</span>
      </div>

      <ul className='navbar__cart-products dropdown_menu--animated dropdown_menu'>
        {!size
          ? <li className='navbar__cart-empty'>Корзина пуста</li>
          : cartStore.cart.map((item) => (
            <Fragment key={item.product.id}>
              <li className='navbar__cart-product'>
                <img className='navbar__cart-product-image' src={imageLink} alt={item.product.name} />

                <div className='navbar__cart-product-details'>
                  <div className='navbar__cart-product-name'>
                    {item.product.name}
                  </div>

                  <div className='navbar__cart-product-price'>
                    {format(item.product.price)}
                  </div>
                </div>

                <div className='navbar__cart-remove' onClick={() => cartStore.removeFromCart(item.product.id)}>
                  X
                </div>
              </li>

              <div className='divider' />
            </Fragment>
          ))}

        {cartStore.cart.length ? (
          <div className='dropdown_menu-btn' onClick={() => navigate('/order-page')}>
            <span>Зробити Замовлення</span>
          </div>) : ''}
      </ul>
    </div>
  );
};

export default observer(Cart);
