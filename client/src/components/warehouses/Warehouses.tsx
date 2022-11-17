import { FC } from 'react';
import { generalStore } from "../../store";

interface PropsType {
  warehouses: string[],
  section: string;
  onSelect: (...args: any[]) => void;
  className?: string;
}

const Warehouses: FC<PropsType> = ({ warehouses , section, onSelect, className}) => {
  return (
    <ul
      className={`shipping__warehouses ${className} custom-dropdown 
          ${generalStore.openSection === section
        ? 'open'
        : 'hide'}`}
    >
      {!warehouses.length
        ? <li>Складів не знайдено</li>
        : warehouses.map((warehouse) => (
          <li
            key={warehouse}
            className='shipping-warehouse'
            onClick={() => onSelect(warehouse)}
          >
            {warehouse}
          </li>
        ))}
    </ul>
  );
};

export default Warehouses;