import React, { ChangeEvent, FC, FormEvent, useCallback, useState } from 'react';
import { observer } from "mobx-react-lite";

import { generalStore, shippingStore } from "../../../../store";

import { debounce } from "../../../../utils/Debounce";

import { fetchWarehouses } from '../../../../store/shipping/ShippingService';

import './styles/PostOfficeAddress.scss'

const WAREHOUSE_SECTION = 'warehouseSection';

interface PropsType {
  onChange: (property: string, value: string) => void;
}

const PostOfficeAddress: FC<PropsType> = ({ onChange }) => {
  const [searchPlace, setSearchPlace] = useState('');

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [searchWarehouse, setSearchWarehouse] = useState('');
  const [activeWarehouses, setActiveWarehouses] = useState(shippingStore.warehouses);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    generalStore.setOpenSection(WAREHOUSE_SECTION);
  }

  const handleSearchCity = (e: FormEvent<EventTarget>) => {
    const { value: city } = e.target as HTMLInputElement;
    setSearchPlace(city);

    if (city) {
      fetchWarehouses(city).then(() => { });
    }
  }

  const handleSearchWarehouse = (e: FormEvent<EventTarget>) => {
    const { value } = e.target as HTMLInputElement;
    setSearchWarehouse(value);

    const warehouses = shippingStore.getWarehouses();

    const findWarehouse = warehouses.filter((warehouse) => {
      return warehouse.toLowerCase().includes(value.toLowerCase());
    });

    setActiveWarehouses(findWarehouse);
  }

  const handleSelect = (warehouse: string) => {
    setSelectedWarehouse(warehouse);
    onChange('address', warehouse);
    generalStore.setOpenSection(null);
  }

  const debounceCitySearch = useCallback(debounce(handleSearchCity, 500), []);
  const debounceWarehouses = useCallback(debounce(handleSearchWarehouse, 200), []);

  return (
    <div className='order-page__post-office'>
      <input
        type='text'
        placeholder='Місто'
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const { value: city } = e.target as HTMLInputElement;

          onChange('city', city);
          debounceCitySearch(e);
        }}
        className='order-page__shipping-input custom-input'
        required
      />
      <div className='order-page__warehouses-input'>
        <input
          className='order-page__shipping-input custom-input'
          type='text'
          placeholder='Введіть номер, або адресу відділення'
          value={selectedWarehouse}
          onClick={(e: any) => handleOpen(e)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value: warehouse } = e.target as HTMLInputElement;
            
            onChange('address', warehouse);
            setSelectedWarehouse(warehouse);
            debounceWarehouses(e);
          }}
          required
        />

        <ul
          className={`order-page__shipping-warehouses custom-dropdown 
          ${generalStore.openSection === WAREHOUSE_SECTION
              ? 'open'
              : 'hide'}`}
        >
          {!activeWarehouses.length
            ? <li><div>Складів не знайдено</div></li>
            : activeWarehouses.map((warehouse) => (
              <li
                key={warehouse}
                className='shipping-warehouse'
                onClick={() => handleSelect(warehouse)}
              >
                {warehouse}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default observer(PostOfficeAddress);
