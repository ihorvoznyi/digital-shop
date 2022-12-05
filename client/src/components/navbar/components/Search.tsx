import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState, useCallback } from 'react';
import { BsSearch } from 'react-icons/bs';
import { generalStore, productStore } from '../../../store';
import { IProduct } from '../../../store/product/interfaces';
import { getInitial, searchProduct } from '../../../store/product/ProductService';
import { debounce } from '../../../utils';

import './styles/Search.scss';

const Search = () => {
  const [keyword, setKeyword] = useState<string>('');

  const handleSearch = (value: string) => {

    const tag = generalStore.currentTypeId;

    if (!value && !tag) return getInitial();

    searchProduct(value)
      .then((products: IProduct[]) => {
        productStore.setProducts(products);
      });
  };

  const debounceChange = useCallback(debounce(handleSearch, 200), []);

  return (
    <div className='navbar__search'>
      <div className='navbar__search-icon'>
        <BsSearch />
      </div>

      <input
        type='text'
        placeholder='Пошук'
        value={keyword}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const { value } = event.target;

          setKeyword(value);
          debounceChange(value);
        }}
      />
    </div>
  );
};

export default observer(Search);
