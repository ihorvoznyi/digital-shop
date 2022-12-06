import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { cartStore } from '../../../store';
import { IProduct } from '../../../store/product/interfaces';
import { Format } from '../../../utils';

const defaultImage = 'https://jabko.ua/image/cache/catalog/products/2022/04/081823/iphone11-black-select-2019-124x124.jpg';

interface PropsType {
  product: IProduct;
}

const CartItem: FC<PropsType> = ({ product }) => {

  const [isImageError, setIsImageError] = useState(false);

  const imageUrl = !isImageError ? product.image : defaultImage;

  const onImageError = () => setIsImageError(true);

  return (
    <>
      <li className='navbar__cart-product'>
        <div className='navbar__cart-right'>
          <img className='navbar__cart-product-image' src={imageUrl} alt={product.name} onError={onImageError} />

          <div className='navbar__cart-product-details'>
            <div className='navbar__cart-product-name'>
              {product.name}
            </div>

            <div className='navbar__cart-product-price'>
              {Format.format(product.price)} грн
            </div>
          </div>
        </div>

        <div className='navbar__cart-remove' onClick={() => cartStore.removeFromCart(product.id)}>
          <span>X</span>
        </div>
      </li>

      <div className='divider' />
    </>
  )
}

export default observer(CartItem);