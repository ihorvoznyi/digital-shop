import React, { FC, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';
import './Layout.scss';
import { observer } from "mobx-react-lite";
import { generalStore } from "../../store";
import { Loader } from "../../components";
import { fetchTypes } from '../../store/general/services/TypeService';

interface ILayout {
  children: React.ReactNode;
}

const Layout: FC<ILayout> = ({ children }) => {

  useEffect(() => {
    fetchTypes();
  }, []);

  if (generalStore.isLoading) return <Loader />;

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

export default observer(Layout);
