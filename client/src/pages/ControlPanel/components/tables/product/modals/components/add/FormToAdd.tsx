import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react'
import { debounce } from '../../../../../../../../utils';
import { IBrand, IType } from '../../../../../../../../store/general/interfaces';
import { fetchBrands, fetchTypes } from '../../../../../../../../store/general/services';
import { useStyles, customization } from '../../../Styles';
import { validateProduct } from '../../../../../../../../store/product/ProductService';
import { filterableGridColumnsIdsSelector } from '@mui/x-data-grid';

interface PropsType {
  onChange: (key: string, value: string) => void;
  onSelect: (select: string, value: string) => void;
}

const FormToAdd: FC<PropsType> = ({ onChange, onSelect }) => {
  const classes = useStyles();

  const [types, setTypes] = useState<IType[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [nameError, setNameError] = useState<boolean>(false);

  const handleSelect = useCallback(((select: string, value: string) => {
    onSelect(select, value);
  }), []);

  const handleChange = useCallback(((event: SelectChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    if (name === 'name') {
      validateProduct(value).then((status) => setNameError(!status));
    }

    onChange(name, value);
  }), []);

  const handleChangePrice = useCallback(((event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.currentTarget;

    const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const isValid = value.split('').map((char) => allowed.includes(char)).includes(false);

    if (!value) {
      setPrice('0');
      onChange('price', '0');
    }
    if (isValid) return;

    if (parseInt(value, 10) > 0) {
      let finalValue = value;

      if (value[0] === '0') {
        finalValue = finalValue.slice(1);
      }

      setPrice(finalValue);
      onChange('price', finalValue);
    }
  }), []);

  const debounceChange = useCallback(debounce(handleChange, 200), []);

  useEffect(() => {
    fetchTypes().then((data) => setTypes(data));
    fetchBrands().then((data) => setBrands(data));
  }, []);

  return (
    <Box sx={{ flex: 2, display: 'grid', width: '100%', gridTemplate: `'name name' 'type brand' 'description description' '. price'`, gap: 1 }}>
      <TextField
        fullWidth
        label='Назва'
        name='name'
        InputLabelProps={{ style: { color: 'aliceblue' } }}
        value={name}
        onChange={(e: any) => {
          setName(e.target.value);
          debounceChange(e);
        }}
        error={nameError}
        sx={customization.inputName}
      />
      <FormControl>
        <InputLabel id='demo-simple-select-label' classes={{ root: classes.inputLabelRoot }}>Тип</InputLabel>
        <Select
          className={classes.select}
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={type}
          label='Type'
          onChange={(e: any) => {
            setType(e.target.value);
            handleSelect('type', e.target.value);
          }}
        >
          {types.length
            ? types.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)
            : <MenuItem value={''}>Не вибрано</MenuItem>}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id='demo-simple-select-label' classes={{ root: classes.inputLabelRoot }}>Бренд</InputLabel>
        <Select
          className={classes.select}
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          label='Brand'
          value={brand}
          onChange={(e: any) => {
            setBrand(e.target.value);
            handleSelect('brand', e.target.value);
          }}
        >
          {brands.length
            ? brands.map((brand) => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)
            : <MenuItem>Не вибрано</MenuItem>}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label='Опис'
        name='description'
        InputLabelProps={{ style: { color: 'aliceblue' } }}
        sx={customization.inputDescription}
        value={description}
        onChange={(e: any) => {
          setDescription(e.target.value);
          debounceChange(e);
        }}
        rows={3}
        multiline
      />
      <TextField
        label='Ціна'
        name='price'
        InputProps={{ inputMode: 'numeric' }}
        InputLabelProps={{ style: { color: 'aliceblue' } }}
        sx={customization.inputPrice}
        value={price}
        onChange={(e: any) => {
          handleChangePrice(e);
        }}
      />
    </Box>
  )
};

export default observer(FormToAdd);