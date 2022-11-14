import React, { FC } from 'react';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

import './Layout.scss';

interface ILayout {
  children: React.ReactNode;
}

const Layout: FC<ILayout> = ({ children }) => {
  return (
    <div className='layout'>
      <Navbar />

      <div className='layout__content'>
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
