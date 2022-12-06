import { FC, useState, useEffect } from 'react';
import { Autocomplete, Chip, TextField, Box, Typography } from '@mui/material';

import { Loader } from '../../../../components';
import { fetchBrands } from '../../../../store/general/services';
import { IBrand } from '../../../../store/general/interfaces';

interface PropsType {
  onChange: (field: string, values: string[]) => void;
};

const FilterBrand: FC<PropsType> = ({ onChange }) => {
  const [brands, setBrands] = useState<IBrand[]>([]);

  const handleChange = (options: string[]) => {
    onChange('brands', options);
  };

  useEffect(() => {
    fetchBrands().then((data: IBrand[]) => setBrands(data));
  }, []);

  if (!brands.length) return <Loader />

  return (
    <Box>
      <Typography variant='h6' component='h5' color='aliceblue'>Бренди</Typography>

      <Autocomplete
        multiple
        options={brands.map((option) => option.name)}
        freeSolo
        onChange={(_, selected: string[]) => handleChange(selected)}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant='outlined' label={option} {...getTagProps({ index })} />
          ))
        }
        sx={{ bgcolor: 'aliceblue', borderRadius: 2 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant='outlined'
            placeholder='Значення'
          />
        )}
      />
    </Box>
  )
}

export default FilterBrand