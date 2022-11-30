import { FC } from "react";
import { IProduct } from "../../../store/product/interfaces";
import { ProductItem } from "./index";

import './styles/ProductList.scss';

interface PropsType {
  products: IProduct[],
}

const ProductList: FC<PropsType> = ({ products }) => {
  return (
    <div className='product-list'>
      <div className="product-list__container">
        {products && products.map((product) => (
          <ProductItem key={product.id} product={product}/>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
