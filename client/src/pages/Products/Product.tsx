import './styles/Product.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productStore, cartStore } from '../../store';
import { observer } from 'mobx-react-lite';
import { IProduct } from '../../store/product/interfaces';
import { Loader } from '../../components';
import { Reviews, Details, Features } from './components';
import { getProduct } from '../../store/product/ProductService';

const defaultImg = 'https://jabko.ua/image/cache/catalog/products/2022/09/072318/photo_2022-09-07_22-53-30-1397x1397.jpg.webp';

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState<IProduct | null>(null);

  const [isImgError, setIsImgError] = useState(false);

  const imgUrl = !isImgError ? product?.image : defaultImg;

  const handleBuyProduct = (product: IProduct) => {
    cartStore.addToCart(product);
    navigate('/order-page');
  }

  const onImageError = () => {
    setIsImgError(true);
  };

  useEffect(() => {
    getProduct(id as string).then((item) => setProduct(item));
  }, []);

  if (productStore.isLoading) return <Loader />
  if (!product) {
    navigate('/');
    return <></>;
  }

  return (
    <div className='product-page'>
      <div className='product-page__container'>
        <div className='product-page__product'>
          <div className='product-page__image'>
            <img src={imgUrl} alt={'Product'} onError={onImageError} />
          </div>

          <div className='product-page__right-side'>
            <div className='product-page__details'>
              <Details product={product as IProduct} />

              {product.isActive ? (
                <div className='product-page__buttons'>
                  <div className='product-page__buy-btn' onClick={() => handleBuyProduct(product)}>
                    Купити
                  </div>

                  <div className='product-page__cart-btn' onClick={() => cartStore.addToCart(product)}>
                    Додати в Кошик
                  </div>
                </div>
              ) : <div className='product-page__disabled'>Немає в наявності</div>}

            </div>
          </div>
        </div>
        <Features features={product.features} />
        <Reviews reviews={product.comments} />
      </div>
    </div>
  );
};

export default observer(Product);
