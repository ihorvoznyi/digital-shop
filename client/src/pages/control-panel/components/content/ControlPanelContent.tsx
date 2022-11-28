import { useEffect, useState, FC } from 'react';
import { fetchBrands, fetchTypes } from '../../../../store/general/services';
import { fetchProducts } from '../../../../store/product/services/ProductService';

import './ControlPanelContent.scss';

interface PropsType {
  typeName: string;
}

const ControlPanelContent: FC<PropsType> = ({ typeName }) => {

  const [data, setData] = useState([]);

  console.log(typeName);


  return (
    <div className="control-panel__content">
      <div className="control-panel__content-container">
        <div className="control-panel__content-header">
          <div className="control-panel__content-title">
            <span>{typeName === 'types'
              ? 'Типи'
              : typeName === 'brands'
                ? 'Бренди'
                : 'Товари'}
            </span>
          </div>

          <div className="control-panel__content-btn">
            <span>Додати {typeName === 'types'
              ? 'Тип'
              : typeName === 'brands'
                ? 'Бренд'
                : 'Товар'}
            </span>
          </div>
        </div>

        <div className="control-panel__content-table">
          <div className="control-panel__content-table-headers">

          </div>

          <div className="control-panel__content-rows">
            <div className="cotrol-panel__content-row">

            </div>

            <div className="cotrol-panel__content-row">

            </div>

            <div className="cotrol-panel__content-row">

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanelContent