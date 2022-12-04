import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom"
;
import { productStore } from "../../store";

import { ProductList } from "./components";
import { Loader } from "../../components";

import { getProductsByType } from '../../store/product/ProductService';

import './styles/Products.scss';

interface PropsType {
  id: string;
  tag: string;
  name: string;
}

const Products: FC<PropsType> = (link) => {
  const location = useLocation().pathname;

  useEffect(() => {
    getProductsByType(link.id);
  }, [location]);

  if (productStore.isLoading) return <Loader />

  return (
    <div className='products'>
      <div className="products__container">
        <ProductList products={productStore.products} />
      </div>
    </div>
  );
};

export default observer(Products);


