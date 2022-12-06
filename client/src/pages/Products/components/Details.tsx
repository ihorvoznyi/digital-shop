import React, { FC } from 'react';
import { Rating } from '../../../components';
import Format from '../../../utils/Format';
import { IProduct } from '../../../store/product/interfaces';
import './styles/Details.scss';

interface PropsType {
  product: IProduct
}

const Details: FC<PropsType> = ({ product }) => {
  const { format, formatEstimates, convertToDollar } = Format;

  return (
    <>
      <div className='product-details__title'>
        <span>
          {product.name}
        </span>
      </div>

      <div className='product-details__rating'>
        <Rating rating={product.rating} fontSize={'18px'} />
        <div>
          {formatEstimates(product.comments.length)}
        </div>
      </div>

      <div className='product-details__price'>
        <span>{format(convertToDollar(product?.price))} $</span>
        <span>{format(product.price)} грн</span>
      </div>

      <p className='product-details__description'>{product.description}</p>
    </>
  );
};

export default Details;
