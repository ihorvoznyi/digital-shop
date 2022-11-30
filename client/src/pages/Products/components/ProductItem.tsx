import { FC } from 'react';
import { IProduct } from "../../../store/product/interfaces";
import { Rating } from "../../../components";

import Format from "../../../utils/Format";
import './styles/ProductItem.scss';
import { useNavigate } from "react-router-dom";

interface PropsType {
  product: IProduct,
}

const imageUrl = 'https://jabko.ua/image/cache/catalog/products/2022/09/072253/photo_2022-09-07_22-53-30-300x300.jpg.webp';

const ProductItem: FC<PropsType> = ({ product }) => {
  const navigate = useNavigate();

  const { format, convertToDollar } = Format;

  const handleClick = (id: string) => {
    const path = `/${product.type.typeTag}/${id}`;
    navigate(path);
  }

  return (
    <div className='product-item' onClick={() => handleClick(product.id)}>
      <div className="product-item__container">
        <div className="product-item__image">
          <img src={imageUrl} alt={'Product'}/>
        </div>

        <div className="product-item__details">
          <div className="product-item__rating">
            <Rating rating={product.rating} fontSize={'24px'}/>
          </div>

          <div className="product-item__title">
            <span>{product.name}</span>
          </div>

          <div className="divider"/>

          <div className="product-item__price">
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
