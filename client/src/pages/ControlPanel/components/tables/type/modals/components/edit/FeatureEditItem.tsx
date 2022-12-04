import { FC, useCallback, useMemo, useState, ChangeEvent } from 'react'
import { observer } from 'mobx-react-lite';
import { Box, TextField, Typography, IconButton } from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckIcon from '@mui/icons-material/Check';

import { debounce } from '../../../../../../../../utils';
import { customization, useStyles } from '../../../../product/Styles';
import { IEditFeature } from '../../../interfaces';
import { AiOutlineDelete } from 'react-icons/ai';

interface PropsType {
  feature: IEditFeature;
  onChange: (updatedFeature: IEditFeature) => void;
  onDelete: (id: string) => void;
  uniques: string[];
}

const FeatureEditItem: FC<PropsType> = (props) => {
  const { feature, uniques, onChange, onDelete } = props;

  const classes = useStyles();

  const [name, setName] = useState(feature.name);
  const [isNameError, setIsNameError] = useState<boolean>(false);

  const [isEditFeature, setIsEditFeature] = useState<boolean>(false);

  const handleSave = () => {
    if (!name || isNameError) return setIsNameError(true);

    setIsNameError(false);
    setIsEditFeature(false);

    onChange({ ...feature, name });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (uniques.includes(value) && value !== feature.name) setIsNameError(true);
    else setIsNameError(false);

    setName(value);
  };

  const handleDelete = (id: string) => onDelete(id);

  const handleCancel = () => setIsEditFeature(false);

  return (
    <Box>
      {isEditFeature ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <TextField
            id='standard-basic'
            className={classes.standardInput}
            label='Назва характеристики'
            InputLabelProps={{ style: { color: 'aliceblue' } }}
            variant='standard'
            error={isNameError}
            value={name}
            onChange={handleChange}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => handleSave()}
              sx={{ color: 'aliceblue' }}
            >
              <CheckIcon />
            </IconButton>

            <IconButton
              onClick={() => handleCancel()}
              sx={{ color: 'aliceblue' }}
            >
              <CancelOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <Typography variant='body2' component='p' sx={{
            fontSize: '14px',
            color: 'aliceblue',
            mt: 2,
            position: 'relative'
          }}>
            {feature.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setIsEditFeature(true)}
              sx={{
                color: 'aliceblue',
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(feature.id)}
              sx={{
                color: 'aliceblue',
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
};

export default observer(FeatureEditItem);
