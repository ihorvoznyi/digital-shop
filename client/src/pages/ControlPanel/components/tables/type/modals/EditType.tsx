import { useState, useEffect, ChangeEvent } from 'react';
import { Backdrop, Box, Button, Fade, IconButton, Modal, TextField, Tooltip, Typography } from '@mui/material';
import { v4 as uuid } from 'uuid';

import AddBoxIcon from '@mui/icons-material/AddBox';

import { modalStore } from '../../../../../../store';
import FormToEdit from './components/edit/FormToEdit';
import { fetchType, updateType } from '../../../../../../store/general/services';
import { IEditFeature, IEditType, IType } from '../interfaces';
import { Loader } from '../../../../../../components';

import { styles } from '../Styles';
import { FeatureEditItem } from './components';

const AddTypeModal = () => {

  const { isEditModal, setIsEditModal } = modalStore;

  const [type, setType] = useState<IEditType>({
    id: '',
    name: '',
    tag: '',
    features: [],
  });

  const [uniqueFeatures, setUniqueFeatures] = useState<string[]>([]);

  const [tag, setTag] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [features, setFeatures] = useState<IEditFeature[]>([]);

  const [featureName, setFeatureName] = useState<string>('');
  const [isNewFeatureError, setIsNewFeatureError] = useState<boolean>(false);

  const handleSubmit = () => {
    console.log('tag', tag);
    console.log('name', name);
    if (tag && name) {
      console.log('called');

      updateType({
        id: type.id,
        tag,
        name,
        features,
      }).then((status: boolean) => {
        if (status) {
          setIsEditModal(false, '');
          window.location.reload();
        }
      });
    }
  };

  const handleAddFeature = () => {
    const id = 'flagged' + uuid();

    const candidate = featureName.toLocaleLowerCase();

    if (uniqueFeatures.includes(candidate)) return setIsNewFeatureError(true);

    setUniqueFeatures((prev) => ([ ...prev, featureName ]));

    const newFeature: IEditFeature = {
      id,
      name: featureName,
      flag: 'new',
    };

    setFeatures((prev) => ([...prev, newFeature]));
    setFeatureName('');
  };

  const validateNewFeature = (value: string) => {
    if (uniqueFeatures.includes(value)) return setIsNewFeatureError(true);

    setIsNewFeatureError(false);
    setFeatureName(value);
  };

  const handleChange = (key: string, value: string) => {
    if (key === 'name') setName(value);
    else setTag(value);
  };

  const handleUpdateFeature = (updated: IEditFeature) => {
    const { id } = updated;

    const list = features.map((feature) => {
      if (feature.id === id) feature.name = updated.name;

      return feature;
    });

    setFeatures([...list]);
  };

  const handleDelete = (id: string) => {
    setFeatures((prev) => (prev.filter((item) => item.id !== id)));
  };

  useEffect(() => {
    fetchType(modalStore.editingId).then((data: IType) => {
      setType(data);

      const list = data.features.map((feature) => ({
        ...feature,
        flag: 'update',
      }));

      const names = data.features.map((feature) => feature.name);

      setName(data.name);
      setTag(data.tag);

      setFeatures(list);
      setUniqueFeatures(names);
    });
  }, []);

  if (!type.id) return <Loader />

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
            Редагувати тип
          </Typography>

          <Box>
            <FormToEdit onChange={handleChange} type={type} />

            <Box>
              <Typography variant='h6' component='p' sx={{ fontSize: '14px', color: 'aliceblue', my: 2 }}>
                Характеристики
              </Typography>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                height: '300px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {features.map((feature) => (
                  <FeatureEditItem
                    key={feature.id}
                    feature={feature}
                    uniques={uniqueFeatures}
                    onChange={handleUpdateFeature}
                    onDelete={handleDelete}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'inline-block', cursor: 'pointer' }}>
                <TextField
                  variant='standard'
                  placeholder='Характеристика'
                  sx={styles.inputStyle}
                  value={featureName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const { value } = event.target;

                    validateNewFeature(value);
                    setFeatureName(value);
                  }}
                  error={isNewFeatureError}
                >

                </TextField>
                <Tooltip title='Add new item'>
                  <IconButton
                    disableFocusRipple
                    disableRipple
                    sx={{ color: 'aliceblue' }}
                    onClick={handleAddFeature}
                  >
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
            <Button variant='contained' onClick={handleSubmit}>Редагувати</Button>
            <Button variant='outlined' onClick={() => setIsEditModal(false, '')}>Скасувати</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

{/* <Typography key={feature} variant='body2' component='p' sx={{
  fontSize: '14px',
  color: 'aliceblue',
  mt: 2,
  position: 'relative'
}}>
  {feature}

  <IconButton
    onClick={() => handleDelete(feature)}
    sx={{
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'aliceblue',
    }}
  >
    <CancelOutlinedIcon />
  </IconButton>
</Typography> */}

export default AddTypeModal;