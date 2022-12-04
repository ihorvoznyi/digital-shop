import { FC, FormEvent, Fragment, useState } from 'react';
import { Backdrop, Box, Button, Fade, IconButton, Modal, TextField, Tooltip, Typography } from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { styles } from '../Styles';
import { createType } from '../../../../../../store/general/services';
import { modalStore } from '../../../../../../store';
import FormToAdd from './components/add/FormToAdd';

const AddTypeModal = () => {
  const { isCreateModal, setIsCreateModal } = modalStore;

  const [features, setFeatures] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [featureValue, setFeatureValue] = useState<string>('');

  const handleCreate = () => {
    if (tag && name) {
      createType({
        typeName: name,
        tag,
        featureList: features,
      }).then((status: boolean) => {
        if (status) {
          setIsCreateModal(false);
          window.location.reload();
        }
      });
    }
  };

  const handleChange = (key: string, value: string) => {
    if (key === 'name') setName(value);
    else setTag(value);
  };

  const handleAddFeature = () => {
    if (featureValue && !features.includes(featureValue)) {
      setFeatures((prev) => ([...prev, featureValue]));
      setFeatureValue('');
    }
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
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
          <Typography id="transition-modal-title" variant="h6" component="h2" color="aliceblue">
            Додати тип
          </Typography>

          <Box>
            <FormToAdd onChange={handleChange} />

            <Box>
              <Typography variant='h6' component='p' sx={{ fontSize: '14px', color: 'aliceblue', my: 2 }}>
                Характеристики
              </Typography>

              <Box sx={{ lineHeight: 1, height: '300px', maxHeight: '300px', overflowY: 'auto' }}>
                {features.map((feature) => (
                  <Fragment key={feature}>
                    <Typography variant='body2' component='p' sx={{
                      fontSize: '14px',
                      color: 'aliceblue',
                      mt: 2,
                      position: 'relative'
                    }}>
                      {feature}

                      <IconButton
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'aliceblue'
                        }}
                        onClick={() => setFeatures((prev) => ([...prev.filter((item) => item !== feature)]))}
                      >
                        <CancelOutlinedIcon />
                      </IconButton>
                    </Typography>
                  </Fragment>
                ))}
              </Box>

              <Box sx={{ display: 'inline-block', cursor: 'pointer' }}>
                <TextField
                  variant='standard'
                  placeholder='Характеристика'
                  sx={styles.inputStyle}
                  value={featureValue}
                  onChange={(e: any) => setFeatureValue(e.target.value)}
                >

                </TextField>
                <Tooltip title='Add new item'>
                  <IconButton
                    disableFocusRipple
                    disableRipple
                    sx={{ color: 'aliceblue' }}
                    onClick={() => handleAddFeature()}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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

export default AddTypeModal;