import './style.scss';
import { Routes, Route } from 'react-router-dom';
import { Login, Registration, Cabinet, Home } from './pages';
import { Orders, Personal } from './pages/Cabinet/components';

export const App = () => {
  const isAuth = true;

  return (
    <div className='app container'>
      <Routes>
        <Route path='/home' element={<Home />} />
        {isAuth ? (
          <>
            <Route path='/cabinet' element={<Cabinet><Personal /></Cabinet>} />
            <Route path='/cabinet/orders' element={<Cabinet><Orders /></Cabinet>} />
          </>
        ) : (
          <>
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
          </>
        )}
        <Route path='*' element={<Home />} />
      </Routes>
    </div>
  );
};
