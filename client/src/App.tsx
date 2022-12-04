import { Fragment, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Login, Registration, Cabinet, Home, Products, Order } from './pages';
import { ControlPanel, Orders, Personal } from './pages/Cabinet/components';
import { generalStore, userStore } from './store';
import { Loader } from './components';
import Product from './pages/Products/Product';
import { auth } from './store/user/services/AuthService';

export const App = observer(() => {

  const isAuth = userStore.isAuth;

  useEffect(() => {
    auth();
  }, []);

  if (userStore.isLoading) return <Loader />;

  return (
    <div className='app container' onClick={() => {
      if (generalStore.openSection !== null) {
        generalStore.setOpenSection(null);
      }
    }}>
      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='/order-page' element={<Order />} />
        {generalStore.types && generalStore.types.map((type) => (
          <Fragment key={type.id}>
            <Route
              path={`/${type.tag}`}
              element={<Products id={type.id} tag={type.tag} name={type.name} />}
            />

            <Route
              path={`/${type.tag}/:id`}
              element={<Product />}
            />
          </Fragment>
        ))}
        {isAuth ? (
          <>
            <Route path='/cabinet' element={<Cabinet><Personal /></Cabinet>} />
            <Route path='/cabinet/orders' element={<Cabinet><Orders /></Cabinet>} />
            {userStore.user.role === 'Admin' && (
              <>
                <Route
                  path='/control-panel/types'
                  element={<ControlPanel />}
                />
                <Route
                  path='/control-panel/brands'
                  element={<ControlPanel />}
                />
                <Route
                  path='/control-panel/products'
                  element={<ControlPanel />}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
          </>
        )}
      </Routes>
    </div>
  );
});
