import { Box, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FC, useState, useCallback, FormEvent } from 'react'
import { validateType } from '../../../../../../../../store/general/services';
import { debounce } from '../../../../../../../../utils';
import { IEditType } from '../../../interfaces';
import { styles } from '../../../Styles';

interface PropsType {
  onChange: (key: string, value: string) => void;
  type: IEditType;
}

const FormToEdit: FC<PropsType> = ({ onChange, type }) => {
  const [name, setName] = useState(type.name);
  const [tag, setTag] = useState(type.tag);

  const [isNameError, setIsNameError] = useState(false);
  const [isTagError, setIsTagError] = useState(false);

  const handleChange = (event: FormEvent<EventTarget>) => {
    const { name, value } = event.target as HTMLInputElement;

    if (name === 'name' && !value) {
      setIsNameError(true);

      return onChange(name, value);
    } 

    if (name === 'tag' && !value) {
      setIsTagError(true);

      return onChange(name, value);
    }

    if (name === 'name') {
      validateType(name, value).then((status) => setIsNameError(!status));
    } else {
      validateType(name, value).then((status) => setIsTagError(!status));
    }

    onChange(name, value);
  };

  const debounceChange = useCallback(debounce(handleChange, 200), []);

  return (
    <Box sx={{
      display: 'flex',
      gap: 1
    }}>
      <TextField
        variant='standard'
        placeholder='Назва'
        sx={styles.inputStyle}
        name='name'
        value={name}
        error={isNameError}
        onChange={(e: any) => {
          setName(e.target.value);
          debounceChange(e);
        }}
      />
      <TextField
        variant='standard'
        placeholder='Тег'
        sx={styles.inputStyle}
        name='tag'
        value={tag}
        error={isTagError}
        onChange={(e: any) => {
          setTag(e.target.value);
          debounceChange(e);
        }}
      />
    </Box>
  )
};

export default observer(FormToEdit);