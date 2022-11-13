import './style.scss';
import { Routes, Route } from 'react-router-dom';
import { Auth, Cabinet, Home } from './pages';

export const App = () => {
  const isAuth = false;
  return (
    <div className='app container'>
      <Routes>
        <Route path='/home' element={<Home />} />
        {isAuth ? (
          <Route path='/cabinet' element={<Cabinet />} />
        ) : (
          <Route path='/auth' element={<Auth />} />
        )}
        <Route path='*' element={<Home />} />
      </Routes>
    </div>
  );
};
