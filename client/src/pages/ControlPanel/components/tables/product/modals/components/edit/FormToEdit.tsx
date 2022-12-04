import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FC, useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react'
import { debounce } from '../../../../../../../../utils/Debounce';
import { IBrand } from '../../../../../../../../store/general/interfaces';
import { fetchBrands } from '../../../../../../../../store/general/services';
import { IEditProduct } from '../../../interfaces';
import { useStyles, customization } from '../../../Styles';
import { validateProduct } from '../../../../../../../../store/product/ProductService';

interface PropsType {
  onChange: (key: string, value: string) => void;
  onSelect: (select: string, value: string) => void;
  product: IEditProduct;
}

const FormToEdit: FC<PropsType> = ({ onChange, onSelect, product }) => {
  const classes = useStyles();

  const [brands, setBrands] = useState<IBrand[]>([]);

  const [name, setName] = useState(product.name ? product.name : '');
  const [brand, setBrand] = useState(product.brand.id ? product.brand.id : '');
  const [price, setPrice] = useState(product.price ? product.price : '0');
  const [description, setDescription] = useState(product.description ? product.description : '');
  const [isActive, setIsActive] = useState<string>(product.isActive ? 'active' : 'disabled');

  const [isNameError, setIsNameError] = useState<boolean>(false);

  const handleSelect = useCallback(((select: string, value: string) => {
    onSelect(select, value);
  }), []);

  const handleChange = useCallback(((event: SelectChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    if (name === 'name') {
      validateProduct(value).then((status) => setIsNameError(!status));
    }

    onChange(name, value);
  }), []);

  const handleValidate = (event: FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;

    validateProduct(value).then((status) => setIsNameError(!status));
  };

  const handleChangePrice = useCallback(((event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.currentTarget;

    const allowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const isValid = value.split('').map((char) => allowed.includes(char)).includes(false);

    if (!value) {
      setPrice('0');
      onChange('price', '0');
    }
    if (isValid) return;
    if (value.length > 1 && value[0] === '0') {
      const sliced = value.slice(1);

      setPrice('');
      setPrice(sliced);
      onChange('price', sliced);
    }
    if (new RegExp(/[0-9]/).test(value)) {
      setPrice(value);
      onChange('price', value);
    }
  }), []);

  const debounceChange = useCallback(debounce(handleChange, 200), []);

  useEffect(() => {
    fetchBrands().then((data) => setBrands(data));
  }, []);

  return (
    <Box sx={{ flex: 2, display: 'grid', width: '100%', gridTemplate: `'name name' 'active brand' 'description description' '. price'`, gap: 1 }}>
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
        error={isNameError}
        sx={customization.inputName}
      />
      <FormControl sx={{ gridArea: 'active' }}>
        <InputLabel id='demo-simple-select-label' classes={{ root: classes.inputLabelRoot }}>Статус</InputLabel>
        <Select
          className={classes.select}
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          label='isActive'
          value={isActive}
          onChange={(e: any) => {
            setIsActive(e.target.value);
            handleSelect('isActive', e.target.value);
          }}
        >
          <MenuItem value={'active'}>В Наявності</MenuItem>
          <MenuItem value={'disabled'}>Немає в наявності</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ gridArea: 'brand' }}>
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

export default observer(FormToEdit);