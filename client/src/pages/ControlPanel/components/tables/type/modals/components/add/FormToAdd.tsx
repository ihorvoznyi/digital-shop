import { FC, useState, useCallback, FormEvent } from 'react';
import { Box, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { validateType } from '../../../../../../../../store/general/services';
import { styles } from '../../../Styles';
import { debounce } from '../../../../../../../../utils';

interface PropsType {
  onChange: (key: string, value: string) => void;
}

const FormToAdd: FC<PropsType> = ({ onChange }) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');

  const [nameError, setNameError] = useState<boolean>(false);
  const [tagError, setTagError] = useState<boolean>(false);

  const handleChange = (event: FormEvent<EventTarget>) => {
    const { name, value } = event.target as HTMLInputElement; 

    if (name === 'tag') {
      validateType('tag', value)
      .then((status: boolean) => {
        if (status) return setTagError(false);
        else return setTagError(true);
      });
    } else {
      validateType('name', value)
      .then((status: boolean) => {
        if (status) return setNameError(false);
        else return setNameError(true);
      })
    }

    onChange(name, value);
  }

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
        onChange={(e: any) => {
          setName(e.target.value);
          debounceChange(e);
        }}
        error={nameError ? true : false}
      />
      <TextField
        variant='standard'
        placeholder='Тег'
        sx={styles.inputStyle}
        name='tag'
        value={tag}
        onChange={(e: any) => {
          setTag(e.target.value);
          debounceChange(e);
        }}
        error={tagError ? true : false}
      />
    </Box>
  )
};

export default observer(FormToAdd);