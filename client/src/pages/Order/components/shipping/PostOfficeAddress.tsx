import React, { ChangeEvent, FormEvent, useState } from 'react';
import { generalStore, shippingStore } from "../../../../store";
import './styles/PostOfficeAddress.scss'
import { observer } from "mobx-react-lite";

const WAREHOUSE_SECTION = 'warehouseSection';

const PostOfficeAddress = () => {
  const [searchWarehouse, setSearchWarehouse] = useState('');
  const [searchPlace, setSearchPlace] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const [activeWarehouses, setActiveWarehouses] = useState(shippingStore.warehouses);

  const handleSearchPlace = (e: FormEvent<EventTarget>) => {
    const target = e.target as HTMLInputElement;
    setSearchPlace(target.value);

    if (searchTimeout) clearTimeout(searchTimeout);

    if (target.value) {
      setSearchTimeout(setTimeout((value) => {
        shippingStore.getWarehouses(value);
      }, 700, target.value))
    }
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    generalStore.setOpenSection(WAREHOUSE_SECTION);
  }

  const handleSearchWarehouse = (e: FormEvent<EventTarget>) => {
    const { value } = e.target as HTMLInputElement;
    setSearchWarehouse(value);

    const findWarehouse = shippingStore.warehouses.filter((warehouse) => {
      return warehouse.toLowerCase().includes(value.toLowerCase());
    });

    setActiveWarehouses(findWarehouse);
  }

  return (
    <div className='order-page__post-office'>
      <input
        type='text'
        placeholder='Місто'
        value={searchPlace}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchPlace(e)}
        className='order-page__shipping-input custom-input'
        required
      />
      <div className='order-page__warehouses-input'>
        <input
          className='order-page__shipping-input custom-input'
          type='text'
          placeholder='Введіть номер, або адресу відділення'
          value={searchWarehouse}
          onClick={(e: any) => handleOpen(e)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchWarehouse(e)}
          required
        />

        <ul
          className={`order-page__shipping-warehouses custom-dropdown 
          ${generalStore.openSection === WAREHOUSE_SECTION
            ? 'open'
            : 'hide'}`}
        >
          {!activeWarehouses.length
            ? <li>Складів не знайдено</li>
            : activeWarehouses.map((warehouse) => (
              <li
                key={warehouse}
                className='order-page__shipping-warehouse'
                onClick={() => setSearchWarehouse(warehouse)}
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
