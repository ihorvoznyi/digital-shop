import './styles/Product.scss';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productStore, cartStore } from "../../store";
import { observer } from "mobx-react-lite";
import { IProduct } from "../../store/product/interfaces";
import { Loader } from "../../components";
import { Reviews, Details, Features } from "./components";

const imageUrl = 'https://jabko.ua/image/cache/catalog/products/2022/09/072318/photo_2022-09-07_22-53-30-1397x1397.jpg.webp';

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    productStore.getProduct(id as string).then((item) => setProduct(item));
  }, []);

  const handleAddToCart = (product: IProduct) => {
    cartStore.addToCart(product);
  }

  if (productStore.isLoading) return <Loader/>
  if (!product) {
    navigate('/');
    return <></>;
  }

  return (
    <div className='product-page'>
      <div className="product-page__container">
        <div className="product-page__product">
          <div className="product-page__image">
            <img src={imageUrl} alt={''}/>
          </div>

          <div className="product-page__right-side">
            <div className="product-page__details">
              <Details product={product as IProduct}/>

              <div className="product-page__buttons">
                <div className='product-page__buy-btn'>
                  Купити
                </div>

                <div className='product-page__cart-btn' onClick={() => handleAddToCart(product)}>
                  Додати в Кошик
                </div>
              </div>
            </div>
          </div>
        </div>
        <Features features={product.features}/>
        <Reviews reviews={product.comments}/>
      </div>
    </div>
  );
};

export default observer(Product);
