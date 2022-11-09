import { FC, useState, useEffect } from 'react';
import { Box, FormControl, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { IAddress } from '../../../../../../store/user/interfaces';
import { observer } from 'mobx-react-lite';

interface PropsType {
  addresses: IAddress[];
  onSelect: (address: IAddress) => void;
  onCreate: () => void;
}

const SelectVariants: FC<PropsType> = ({ addresses, onSelect, onCreate }) => {
  const [address, setAddress] = useState('unselected');

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    if (value === 'addAddress') {
      onCreate();
      return;
    }

    setAddress(value);

    onSelect(addresses.find((item) => item.id === value) as IAddress);
  };

  useEffect(() => {
    if (addresses.length) {
      const item = addresses[0];
      setAddress(item.id);
    }
  }, []);

  return (
    <div>
      <FormControl variant="standard" sx={{ minWidth: 120, width: '100%' }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={address}
          onChange={handleChange}
          label="Address"
          sx={{ color: '#fff' }}
        >
          <MenuItem value="unselected" color="white">
            <em>Не вибрано</em>
          </MenuItem>

          {addresses.length && addresses.map((item) => (
            <MenuItem key={item.id} value={item.id} sx={{ position: 'relative' }}>
              <span>{item.city}, {item.address}</span>
            </MenuItem>
          ))}

          <MenuItem value="addAddress">
            <em>Додати Адресу</em>
          </MenuItem>
        </Select>
      </FormControl>
    </div >
  );
}

export default observer(SelectVariants);