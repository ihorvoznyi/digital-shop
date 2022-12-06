import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom'
  ;
import { generalStore, productStore } from '../../store';

import { Filter, ProductList } from './components';
import { Loader } from '../../components';

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
    productStore.isLoading = true;

    getProductsByType(link.id)
      .then((data) => {
        productStore.setProducts(data);
      })
      .finally(() => productStore.isLoading = false);
  }, [location]);

  if (productStore.isLoading) return <Loader />

  return (
    <div className='products'>
      <div className='products__container'>
        <Filter typeId={link.id} />

        <div className='products__content'>
          <ProductList products={productStore.products} />
        </div>
      </div>
    </div>
  );
};

export default observer(Products);


