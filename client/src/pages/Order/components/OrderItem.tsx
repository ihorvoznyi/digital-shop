import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { IProduct } from '../../../store/product/interfaces';
import Format from '../../../utils/Format';
import { cartStore } from '../../../store';

import './styles/OrderItem.scss';

interface PropsType {
  product: IProduct;
  quantity: number;
}

const defaultImg = 'https://jabko.ua/image/cache/catalog/products/2022/04/081823/iphone11-black-select-2019-124x124.jpg';

const OrderItem: FC<PropsType> = ({ product, quantity }) => {
  const [isImageError, setIsImageError] = useState(false);

  const imageUrl = !isImageError ? product.image : defaultImg;

  const { format, convertToDollar } = Format;

  const onImageError = () => setIsImageError(true);

  return (
    <div className='order-item'>
      <div className='order-item__container'>
        <div className='order-item__image'>
          <img src={imageUrl} alt={''} onError={onImageError}/>
        </div>

        <div className="order-item__details">

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
    </div>
  );
};

export default observer(OrderItem);
