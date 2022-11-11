import { Routes, Route } from 'react-router-dom';
import { Login, Registration, Cabinet, Home, Products, Order } from './pages';
import { Orders, Personal } from './pages/Cabinet/components';
import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { generalStore, userStore } from "./store";
import { Loader } from "./components";
import Product from "./pages/Products/Product";

export const App = observer(() => {

  const isAuth = userStore.isAuth;

  useEffect(() => {
    userStore.auth().then(() => console.log(userStore.isLoading));
  }, []);

  if (userStore.isLoading) return <Loader/>;

  return (
    <div className='app container' onClick={() => generalStore.setOpenSection(null)}>
      <Routes>
        <Route path='*' element={<Home/>}/>
        <Route path='/order-page' element={<Order />} />
        {generalStore.types && generalStore.types.map((type) => (
          <Fragment key={type.id}>
            <Route
              path={`/${type.tag}`}
              element={<Products id={type.id} tag={type.tag} name={type.name}/>}
            />

            <Route
              path={`/${type.tag}/:id`}
              element={<Product/>}
            />
          </Fragment>
        ))}
        {isAuth ? (
          <>
            <Route path='/cabinet' element={<Cabinet><Personal/></Cabinet>}/>
            <Route path='/cabinet/orders' element={<Cabinet><Orders/></Cabinet>}/>
          </>
        ) : (
          <>
            <Route path='/login' element={<Login/>}/>
            <Route path='/registration' element={<Registration/>}/>
          </>
        )}
      </Routes>
    </div>
  );
});
