import React, { FC } from 'react';
import { observer } from "mobx-react-lite";
import { featureType } from "../../../store/product/interfaces";
import './styles/Features.scss';

interface PropsType {
  features: featureType[]
}

const Features: FC<PropsType> = ({ features }) => {
  return (
    <div className="product-features">
      <h3 className="product-features__title">Характеристики</h3>

      <div className="product-features__list custom-scrollbar">
        {features.map((feature, idx) => (
          <div
            className={`product-features__row product-features__row_${idx % 2 !== 0 ? 'gray' : 'black'}`}
            key={feature.feature}
          >
            <span>{feature.feature}</span>
            <span>{feature.value === 'true'
              ? 'Так'
              : feature.value === 'false'
                ? 'Ні'
                : feature.value
            }</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(Features);
