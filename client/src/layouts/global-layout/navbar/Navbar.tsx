import './Navbar.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Cart, NavLinks, Profile, Search } from './components';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className='navbar'>
      <div className='navbar__container container'>
        <div className='navbar__navigation'>
          <div className='navbar__logotype' onClick={() => navigate('/')}>
            <span>Endous</span>
          </div>

          <NavLinks />
        </div>

        <div className='navbar__details'>
          <Search />
          <Cart />
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default observer(Navbar);
