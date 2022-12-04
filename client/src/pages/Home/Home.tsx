import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { productStore } from '../../store';
import { ProductList } from '../Products/components';
import { Loader } from '../../components';
import { getInitial } from '../../store/product/ProductService';
import './Home.scss';

const Home = () => {
  const navigate = useNavigate();

  // Redirect
  useEffect(() => navigate('/'), []);

  // Fetch initial Products
  useEffect(() => {
    getInitial();
  }, []);

  if (productStore.isLoading) return <Loader/>

  return (
    <div className='home-page'>
      <ProductList products={productStore.products}/>
    </div>
  );
};

export default observer(Home);
