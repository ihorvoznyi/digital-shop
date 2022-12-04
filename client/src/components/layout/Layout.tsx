import React, { FC, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { observer } from 'mobx-react-lite';
import { generalStore } from '../../store';
import { Loader } from '..';
import { fetchTypes } from '../../store/general/services/TypeService';
import './Layout.scss';

interface ILayout {
  children: React.ReactNode;
}

const Layout: FC<ILayout> = ({ children }) => {

  useEffect(() => {
    generalStore.setLoading(true);
    fetchTypes()
    .then((data) => generalStore.setTypes(data))
    .finally(() => generalStore.setLoading(false));
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
