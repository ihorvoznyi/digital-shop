import { Box, Button } from '@mui/material'
import { observer } from 'mobx-react-lite';
import { FC, memo } from 'react'

interface PropsType {
  onCreate: (e: any) => void;
  onClose: (status: boolean) => void;
}

const CloseSubmit: FC<PropsType> = (props) => {
  const { onCreate, onClose } = props;

  const handleOpen = (event: any) => {
    onCreate(event);
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <Button variant='contained' onClick={handleOpen}>Створити</Button>
      <Button variant='outlined' onClick={handleClose}>Скасувати</Button>
    </Box>
  )
};

export default observer(CloseSubmit);