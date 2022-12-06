import { FormEvent, useState, useCallback } from 'react'
import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material';

import { styles } from '../Styles';
import { createBrand, validateBrand } from '../../../../../../store/general/services';
import { modalStore } from '../../../../../../store';
import { debounce } from '../../../../../../utils';

const AddBrandModal = () => {
  const [brandName, setBrandName] = useState<string>('');
  const [brandError, setBrandError] = useState<boolean>(false);

  const { isCreateModal, setIsCreateModal } = modalStore;

  const handleCreate = () => {
    if (brandName) {

      if (brandError) return;

      createBrand(brandName).then(() => {
        setIsCreateModal(false);
        window.location.reload();
      });
    }
  };

  const handleChange = (e: FormEvent<EventTarget>) => {
    const { value } = e.target as HTMLInputElement;

    validateBrand(value).then((status: boolean) => {
      if (status) setBrandError(false);
      else setBrandError(true);
    });
  };

  const debounceChange = useCallback(debounce(handleChange, 200), []);

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={isCreateModal}
      onClose={() => setIsCreateModal(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isCreateModal}>
        <Box sx={styles.modalBox}>
          <Typography id='transition-modal-title' variant='h6' component='h2' color='aliceblue'>
            Додати Бренд
          </Typography>

          <Box>
            <Box sx={{
              display: 'flex',
              gap: 1
            }}>
              <TextField
                fullWidth
                variant='standard'
                placeholder='Назва'
                sx={styles.inputStyle}
                value={brandName}
                onChange={(e: any) => {
                  setBrandName(e.target.value);
                  debounceChange(e);
                }}
                error={brandError}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
            <Button variant='contained' onClick={handleCreate}>Створити</Button>
            <Button variant='outlined' onClick={() => setIsCreateModal(false)}>Скасувати</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default AddBrandModal;