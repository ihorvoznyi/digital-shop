import React from 'react';
import { BsCart3 } from 'react-icons/bs';

import './styles/Cart.scss';

const imageLink = 'https://jabko.ua/image/cache/catalog/products/2022/04/081823/iphone11-black-select-2019-124x124.jpg';

const Cart = () => {
  return (
    <div className='navbar__cart navbar__cart_dropdown'>
      <div className='navbar__cart-btn'>
        <div className='navbar__cart-icon' data-products={'2'}>
          <BsCart3 />
        </div>

        <span>Кошик</span>
      </div>

      <ul className='navbar__cart-products dropdown_menu--animated dropdown_menu'>
        <li className='navbar__cart-product'>
          <img className='navbar__cart-product-image' src={imageLink} alt='iPhone 11' />

          <div className='navbar__cart-product-details'>
            <div className='navbar__cart-product-name'>
              Apple iPhone 11 64GB (Black)
            </div>

            <div className='navbar__cart-product-price'>
              19 190 грн
            </div>
          </div>
        </li>

        <li className='navbar__cart-product'>
          <img className='navbar__cart-product-image' src={imageLink} alt='iPhone 11' />

          <div className='navbar__cart-product-details'>
            <div className='navbar__cart-product-name'>
              Apple iPhone 11 64GB (Black)
            </div>

            <div className='navbar__cart-product-price'>
              19 190 грн
            </div>
          </div>
        </li>

        <div className='dropdown_menu-btn'>
          <span>Зробити Замовлення</span>
        </div>
      </ul>
    </div>
  );
};

export default Cart;
