import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { observer } from "mobx-react-lite";

import { generalStore, shippingStore } from "../../../../store";

import { useDebounce } from "../../../../hooks/useDebounce";
import { Warehouses } from "../../../../components";

import './styles/PostOfficeAddress.scss'

const WAREHOUSE_SECTION = 'warehouseSection';

const PostOfficeAddress = () => {
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
      shippingStore.fetchWarehouses(city).then(() => {});
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
  }

  const debounceCitySearch = useCallback(useDebounce(handleSearchCity, 500), []);
  const debounceWarehouses = useCallback(useDebounce(handleSearchWarehouse, 200), []);

  return (
    <div className='order-page__post-office'>
      <input
        type='text'
        placeholder='Місто'
        onChange={(e: ChangeEvent<HTMLInputElement>) => debounceCitySearch(e)}
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
            setSelectedWarehouse((e.target as HTMLInputElement).value);
            debounceWarehouses(e);
          }}
          required
        />

        <Warehouses
          warehouses={activeWarehouses}
          section={WAREHOUSE_SECTION}
          onSelect={handleSelect}
          className='order-page__shipping-warehouses'
        />
      </div>
    </div>
  );
};

export default observer(PostOfficeAddress);
