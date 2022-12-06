import { useState, FC, MouseEvent, memo, useCallback } from 'react';

import {
  IconButton,
  TableCell,
  TableRow,
  Checkbox,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

import EditIcon from '@mui/icons-material/Edit';

import { ITableData } from '../../../../../../store/general/interfaces';
import { modalStore } from '../../../../../../store';

interface PropsType {
  row: ITableData,
  isSelected: (name: string) => boolean;
  handleClick: (event: any, name: string) => void;
};

const BrandTableRow: FC<PropsType> = (props) => {
  const { handleClick, row, isSelected } = props;

  const [isEditShown, setIsEditShown] = useState(false);

  const isItemSelected = isSelected(row.id);
  const labelId = `enhanced-table-checkbox-${row.id}`;

  const { setIsEditModal } = modalStore;

  const handleClickEdit = useCallback(((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsEditModal(true, row.id);
  }), []);

  return (
    <TableRow
      role='checkbox'
      aria-checked={isItemSelected}
      tabIndex={-1}
      selected={isItemSelected}
      sx={{
        height: '30px',
        transition: 'background-color 0.5s ease',
        position: 'relative',
        '&:hover': {
          bgcolor: 'primary.dark',
        }
      }}
      onMouseEnter={() => setIsEditShown(true)}
      onMouseLeave={() => setIsEditShown(false)}
    >
      <TableCell padding='checkbox' onClick={(event) => handleClick(event, row.id)}>
        <Checkbox
          color='primary'
          checked={isItemSelected}
          inputProps={{
            'aria-labelledby': labelId
          }}
          sx={{ color: 'aliceblue' }}
        />
      </TableCell>
      <TableCell
        component='th'
        id={labelId}
        scope='row'
        padding='none'
        sx={{ color: 'aliceblue', fontSize: '16px' }}
      >
        {row.name}
        <Typography variant='body2' sx={{ fontSize: '12px' }}>({row.id})</Typography>

        {isEditShown &&
        <IconButton
          sx={{
            position: 'absolute',
            top: '50%',
            right: 2,
            transform: 'translateY(-50%)',
            color: 'white'
          }}

          onClick={handleClickEdit}
        >
          <EditIcon />
        </IconButton>}
      </TableCell>
    </TableRow>
  )
};

export default observer(BrandTableRow);
