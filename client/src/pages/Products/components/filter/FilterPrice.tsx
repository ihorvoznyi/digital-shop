import { FC, useState, ChangeEvent } from 'react';
import { Box, Typography, TextField } from '@mui/material';

import { useStyles } from './styles/Styles';

interface PropsType {
  onChange: (field: string, values: string[]) => void;
};

const FilterPrice: FC<PropsType> = ({ onChange }) => {
  const classes = useStyles();

  const [leftPrice, setLeftPrice] = useState<string>('');
  const [rightPrice, setRightPrice] = useState<string>('');
  const [isPriceError, setIsPriceError] = useState<boolean>(false);

  const handleChangePrice = (side: string, value: string) => {
    const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const isValid = value.split('').map((char) => allowed.includes(char)).includes(false);

    if (!value) {
      let values = [];

      if (side === 'left') {
        setLeftPrice('0');
        values = ['0', rightPrice];
      } else {
        setRightPrice('0');
        values = [leftPrice, '0'];
      }

      onChange('priceRange', values);

      return;
    }

    if (isValid) return;

    if (parseInt(value, 10) > 0) {
      let finalValue = value;
      let values: string[] = [];

      if (value[0] === '0') {
        finalValue = finalValue.slice(1);
      }

      side === 'left'
        ? setLeftPrice(finalValue)
        : setRightPrice(finalValue);
      
      if (side === 'left') {
        setLeftPrice(finalValue);
        values = [finalValue, rightPrice];
      } else {
        setRightPrice(finalValue);
        values = [leftPrice, finalValue];
      }

      onChange('priceRange', values);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant='h6' component='h5' color='aliceblue'>Ціна</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'aliceblue' }}>
        від
        <TextField
          className={classes.standardInput}
          variant='standard'
          placeholder='0'
          value={leftPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePrice('left', e.target.value)}
        />
        до
        <TextField
          className={classes.standardInput}
          variant='standard'
          placeholder='100000'
          error={+rightPrice < +leftPrice}
          value={rightPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePrice('right', e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default FilterPrice