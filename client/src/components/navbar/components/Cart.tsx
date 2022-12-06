import { observer } from 'mobx-react-lite';
import { BsCart3 } from 'react-icons/bs';
import { cartStore } from '../../../store';

import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';

import './styles/Cart.scss';

const Cart = () => {
  const navigate = useNavigate();
  const size = cartStore.cart.length;

  const handleRedirect = () => {
    if (!size) return;
    navigate('/order-page');
  }

  return (
    <div className='navbar__cart navbar__cart_dropdown'>
      <div className='navbar__cart-btn' onClick={() => handleRedirect()}>
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
              <CartItem key={item.product.id} product={item.product} />
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
