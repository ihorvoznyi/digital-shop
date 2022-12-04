import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';


import { ControlPanelSidebar } from './components';

import { ITableData } from '../../store/general/interfaces';
import { fetchTableBrands, fetchTableTypes } from '../../store/general/services';
import { fetchTableProducts } from '../../store/product/ProductService';

import './ControlPanel.scss';

import { ProductTable, TypeTable, BrandTable } from './components/tables';

const ControlPanel = () => {
  const { pathname } = useLocation();

  const route = pathname.split('/').slice(-1)[0];

  const [data, setData] = useState<ITableData[]>([]);

  // Show table according to route
  useEffect(() => {
    (() => {
      switch (route) {
        case 'types': {
          fetchTableTypes().then((data: ITableData[]) => setData([...data]));
          break;
        }

        case 'brands': {
          fetchTableBrands().then((data: ITableData[]) => setData([...data]));
          break;
        }

        case 'products': {
          fetchTableProducts().then((data: ITableData[]) => setData([...data]));
          break;
        }
      }

    })();
  }, [pathname]);

  return (
    <div className="control-panel">
      <div className="control-panel__container">
        <ControlPanelSidebar />

        <div className="control-panel__content">
          {route === 'products' && <ProductTable rows={data} />}
          {route === 'types' && <TypeTable rows={data} />}
          {route === 'brands' && <BrandTable rows={data} />}
        </div>
      </div>
    </div>
  )
}

export default observer(ControlPanel);
