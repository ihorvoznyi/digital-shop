import { useState, useEffect, useCallback, useMemo, FormEvent } from 'react'
import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material';

import { styles } from '../Styles';
import { modalStore } from '../../../../../../store';
import { createBrand, fetchBrand, updateBrand, validateBrand } from '../../../../../../store/general/services';
import { Loader } from '../../../../../../components';
import { debounce } from '../../../../../../utils';

const AddBrandModal = () => {

  const { isEditModal, setIsEditModal } = modalStore;

  const [brand, setBrand] = useState({
    id: '',
    name: '',
    oldName: '',
  });

  const [isBrandError, setIsBrandError] = useState<boolean>(false);

  const handleUpdate = () => {
    if (brand.name === brand.oldName) return;

    if (isBrandError) return;

    updateBrand(brand.id, brand.name).then((status) => {
      if (status) {
        setIsEditModal(false, '');
        window.location.reload();
      }
    });
  };

  const handleValidate = (event: FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;

    if (value === brand.oldName) return setIsBrandError(false);

    validateBrand(value).then((status) => setIsBrandError(!status));
  };

  const debounceValidate = useCallback(debounce(handleValidate, 200), []);

  useEffect(() => {
    fetchBrand(modalStore.editingId).then((data) => {
      setBrand({
        id: data.id,
        name: data.brand,
        oldName: data.brand,
      });
    });
  }, []);

  if (!brand.id) return <Loader />

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isEditModal}
      onClose={() => setIsEditModal(false, '')}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isEditModal}>
        <Box sx={styles.modalBox}>
          <Typography id="transition-modal-title" variant="h6" component="h2" color="aliceblue">
            Редагувати Бренд
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
                value={brand.name}
                onChange={(e: any) => {
                  setBrand((prev) => ({ ...prev, name: e.target.value }));
                  debounceValidate(e);
                }}
                error={isBrandError}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
            <Button variant='contained' onClick={handleUpdate}>Редагувати</Button>
            <Button variant='outlined' onClick={() => setIsEditModal(false, '')}>Скасувати</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default AddBrandModal;