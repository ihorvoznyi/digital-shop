import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { productStore } from '../../store';
import { ProductList } from "../Products/components";
import './Home.scss';
import { Loader } from "../../components";
import { fetchProducts } from '../../store/product/services/ProductService';

const Home = () => {
  const navigate = useNavigate();

  // Redirect
  useEffect(() => navigate('/'), []);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (productStore.isLoading) return <Loader/>

  return (
    <div className='home-page'>
      <ProductList products={productStore.products}/>
    </div>
  );
};

export default observer(Home);
