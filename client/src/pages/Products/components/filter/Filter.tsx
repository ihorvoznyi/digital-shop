import { FC, useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { Box, Button, Typography } from '@mui/material';

import { generalStore, productStore } from '../../../../store';

import { getFilterElements } from '../../../../store/general/services';
import { IFilter, ITypeFeatures } from './IFilter';
import FilterPrice from './FilterPrice';
import FilterBrand from './FilterBrand';
import { getProductsByType } from '../../../../store/product/ProductService';
import { debounce } from '../../../../utils';
import FilterField from './FilterField';

interface PropsType {
  typeId: string;
};

const Filter: FC<PropsType> = ({ typeId }) => {

  const [filterOptions, setFilterOptions] = useState<ITypeFeatures[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<IFilter[]>([]);

  const handleSelect = (field: string, options: string[]) => {
    const keys = selectedOptions.map((option) => option.tag);

    if (keys.includes(field)) {
      const newOptions = selectedOptions.map((option) => {
        if (option.tag === field) {
          option.values = options;
        }

        return option;
      });

      setSelectedOptions([...newOptions]);

      return;
    }

    setSelectedOptions((prev) => ([...prev, { tag: field, values: options }]));
  };

  const handleFilter = () => {
    if (!selectedOptions.length) return;

    const options = selectedOptions.map((option) => {

      if (!option.values.length) return;

      if (option.tag === 'priceRange') {
        const priceArr = option.values;

        if (priceArr[0] === '0' && priceArr[1] === '0') return;
        if (+priceArr[0] > +priceArr[1]) return;
      }

      const optionValues = option.values.join(',');
      const optionName = option.tag;

      return optionName + '=' + optionValues;
    });

    const query = '?' + options.join('&');

    getProductsByType(typeId, query)
      .then((data) => productStore.setProducts(data));
  };

  const debounceFilter = useCallback(debounce(handleFilter, 300), []);

  useEffect(() => {
    getFilterElements(typeId).then((data) => {
      setFilterOptions(data);
    });
  }, [typeId]);

  return (
    <Box sx={{
      maxWidth: '450px',
      overflowY: 'auto',
      bgcolor: '#0F0F0F',
      borderRadius: 2,
      padding: 5,
      position: 'absolute',
      top: '0',
      left: '-5%',
    }}>
      <Typography
        variant='h5'
        component='h4'
        color='aliceblue'
        mb='1rem'
        sx={{ textAlign: 'center', fontWeight: 500 }}
      >
        Фільтр
      </Typography>

      <FilterPrice onChange={handleSelect} />
      <FilterBrand onChange={handleSelect} />

      <Box sx={{
        mt: 1,
      }}>
        {filterOptions.length
          ? filterOptions.map((option) => (
            <Box key={option.tag} sx={{ mt: 1 }}>
              <Typography
                variant='h6'
                component='h5'
                color='aliceblue'
              >
                {option.name}
              </Typography>
              <FilterField option={option} onChange={handleSelect} />
            </Box>
          ))
          : ''
        }
      </Box>

      <Button
        onClick={handleFilter}
        sx={{
          color: 'aliceblue',
          mt: 4,
          padding: '12px 24px',
          bgcolor: '#C42A2C',
          width: '100%',
          fontWeight: 600,
          fontSize: '18px',

          '&:hover': {
            bgcolor: '#8a1d1f',
          }
        }}
      >
        Застосувати
      </Button>
    </Box>
  )
}

export default observer(Filter);