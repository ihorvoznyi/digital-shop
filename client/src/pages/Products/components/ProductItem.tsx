import { FC } from 'react';
import { IProduct } from '../../../store/product/interfaces';
import { Rating } from "../../../components";

import Format from '../../../utils/Format';
import { useNavigate } from 'react-router-dom';
import './styles/ProductItem.scss';

interface PropsType {
  product: IProduct,
}

const imageUrl = 'https://jabko.ua/image/cache/catalog/products/2022/09/072318/photo_2022-09-07_22-53-30-1397x1397.jpg.webp';

const ProductItem: FC<PropsType> = ({ product }) => {
  const navigate = useNavigate();

  const { format, convertToDollar } = Format;

  const handleClick = (id: string) => {
    const path = `/${product.type.tag}/${id}`;
    navigate(path);
  }

  return (
    <div className={`product-item ${!product.isActive ? 'disabled' : ''}`} onClick={() => handleClick(product.id)}>
      <div className='product-item__container'>
        <div className='product-item__image'>
          <img src={product.image ? product.image : imageUrl} alt={'Product'} />
        </div>

        <div className='product-item__details'>
          <div className='product-item__rating'>
            <Rating rating={product.rating} fontSize={'24px'} />
          </div>

          <div className='product-item__title'>
            <span>
              {product.name.length <= 20
                ? product.name
                : product.name.slice(0, 20) + '...'
              }
            </span>
          </div>

          <div className='divider' />

          <div className='product-item__price'>
            <span>
              {format(convertToDollar(product.price))} $
            </span>

            <span>
              {format(product.price)} грн
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
