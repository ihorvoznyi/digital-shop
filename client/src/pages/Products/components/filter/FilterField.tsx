import { FC, useState, useEffect } from 'react';
import { Autocomplete, Chip, TextField } from '@mui/material';

import { generalStore } from '../../../../store';
import { IFilter } from './IFilter';

interface PropsType {
  option: IFilter,
  onChange: (field: string, values: string[]) => void;
}

const FilterField: FC<PropsType> = ({ option, onChange }) => {
  const { tag, values } = option;

  const handleChange = (options: string[]) => {
    onChange(tag, options);
  };

  return (
    <Autocomplete
      multiple
      id='tags-filled'
      options={values.map((value) => value)}
      freeSolo
      sx={{
        bgcolor: 'aliceblue',
        borderRadius: 2,
        minWidth: '150px',
      }}
      onChange={(_, selected: any) => handleChange(selected)}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant='outlined' label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          placeholder={'Значення'}
        />
      )}
    />
  )
}

export default FilterField