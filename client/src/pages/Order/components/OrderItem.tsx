import React, { FC } from 'react';
import { IProduct } from '../../../store/product/interfaces';
import './styles/OrderItem.scss';
import Format from '../../../utils/Format';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../../../store';

interface PropsType {
  product: IProduct;
  quantity: number;
}

const imageLink = 'https://jabko.ua/image/cache/catalog/products/2022/04/081823/iphone11-black-select-2019-124x124.jpg';

const OrderItem: FC<PropsType> = ({ product, quantity }) => {
  const { format, convertToDollar } = Format;
  return (
    <div className='order-item'>
      <div className='order-item__container'>
        <div className='order-item__right'>
          <div className='order-item__image'>
            <img src={imageLink} alt={''} />
          </div>

          <div className='order-item__product'>
            <span>{product.name}</span>

            <div className='order-item__counter'>
              <button
                className='order-item__count-btn'
                onClick={() => cartStore.addToCart(product)}
              >
                <span>+</span>
              </button>

              <span>{quantity}</span>

              <button
                className='order-item__count-btn'
                onClick={() => cartStore.removeOne(product.id)}
              >
                <span>-</span>
              </button>
            </div>
          </div>
        </div>

        <div className='order-item__price'>
          <span>
            {format(product.price)} грн
          </span>

          <span>
            ({format(convertToDollar(product.price))} $)
          </span>
        </div>
      </div>
    </div>
  );
};

export default observer(OrderItem);
