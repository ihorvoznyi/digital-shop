import React, { FC, useEffect } from 'react';
import { productStore } from "../../store";
import { useLocation } from "react-router-dom";
import { ProductList } from "./components";
import { Loader } from "../../components";
import './styles/Products.scss';
import { observer } from "mobx-react-lite";

interface PropsType {
  id: string;
  tag: string;
  name: string;
}

const Products: FC<PropsType> = (link) => {
  const location = useLocation().pathname;

  useEffect(() => {
    productStore.getProductsByType(link.id);
    console.log(link.name + ' loader:' + productStore.isLoading);
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


