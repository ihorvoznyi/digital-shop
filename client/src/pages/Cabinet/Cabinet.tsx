import React from 'react';
import './Cabinet.scss';

import { CabinetSidebar } from './components';
import { FC } from 'react';
import { observer } from "mobx-react-lite";

interface PropsType {
  children: React.ReactNode;
}

const Cabinet: FC<PropsType> = ({ children }) => {
  return (
    <div className='cabinet'>
      <div className='cabinet__container'>
        <CabinetSidebar />

        <div className='cabinet__content'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default observer(Cabinet);
