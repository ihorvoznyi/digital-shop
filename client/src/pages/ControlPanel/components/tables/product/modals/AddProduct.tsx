import { FC, useRef, useState, useMemo, useCallback, memo, useEffect } from 'react';
import { Backdrop, Box, Fade, Modal, Stack, Typography } from '@mui/material';

import { customization } from '../Styles';

import ImageIcon from '@mui/icons-material/Image';
import { IFeature, IType } from '../../../../../../store/general/interfaces';
import { INewProduct, IProductFeature } from '../../../../../../store/product/interfaces';
import { createProduct } from '../../../../../../store/product/ProductService';
import { CloseSubmit, FeatureItem } from './components';
import FormToAdd from './components/add/FormToAdd';
import { fetchType } from '../../../../../../store/general/services';
import { observer } from 'mobx-react-lite';
import { modalStore } from '../../../../../../store';

const AddProductModal = () => {
  const [features, setFeatures] = useState<IFeature[]>([]);

  const { isCreateModal, setIsCreateModal } = modalStore;

  const [product, setProduct] = useState({
    name: '',
    description: '',
    image: '',
    type: '',
    brand: '',
    price: '',
  });

  const [productFeatures, setProductFeatures] = useState<IProductFeature[]>([]);

  const [image, setImage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const { name, description, type, brand, price } = product;

    if (!name || !description || !type || !brand || !price) return;

    const isNotFilled = productFeatures.map((feature) => !feature.value).includes(true);

    if (isNotFilled) return;

    createProduct({
      ...product,
      price: parseFloat(price),
      features: productFeatures,
    }).then(() => {
      setIsCreateModal(false)
      window.location.reload();
    });
  };

  const handleUpload = (event: any) => {
    const file = event.target.files[0];

    setImage(URL.createObjectURL(file));
    setProduct((prev) => ({ ...prev, image: file }));
  };

  const handleChangeFeatures = (id: string, value: string) => {
    const list = productFeatures.map((feature) => {
      if (feature.id === id) {
        feature.value = value;

        return feature;
      }

      return feature;
    });

    return setProductFeatures(list);
  };

  const handleProductChange = useCallback(((name: string, value: string) => {
    const key = name as keyof INewProduct;

    setProduct((prev) => ({ ...prev, [key]: value }));
  }), []);

  const handleSelect = useCallback(((select: string, id: string) => {
    if (select === 'brand') setProduct((prev) => ({ ...prev, brand: id }));
    else {
      setProduct((prev) => ({ ...prev, type: id }));
      fetchType(id).then((data: IType) => {
        setFeatures(data.features);

        const featuresWithValue = data.features.map((feature) => ({ id: feature.id, value: '' }));

        setProductFeatures([...featuresWithValue]);
      });
    }
  }), []);

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
        <Box sx={customization.modalBox}>
          <Typography id='transition-modal-title' variant='h6' component='h2' color='aliceblue' mb={1}>
            Додати товар
          </Typography>

          <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
            {/* Image Box */}
            <Box sx={{ flex: 1, position: 'relative', border: '2px dashed aliceblue', cursor: 'pointer' }} onClick={() => {
              if (fileInputRef.current !== null) {
                fileInputRef.current.click();
              }
            }}>
              {image
                ? <img src={image} alt={image} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',

                  position: 'absolute',
                  top: 0,
                  left: 0,
                }} />
                : <ImageIcon sx={customization.imageIcon} />
              }

              <input
                id='raised-button-file'
                ref={fileInputRef}
                className='create__image-input'
                type='file'
                onChange={handleUpload}
                accept='.png,.jpg,.jpeg'
                hidden
              />
            </Box>

            {/* Content Box */}
            <FormToAdd onChange={handleProductChange} onSelect={handleSelect} />

          </Stack>

          {/* Features Box */}
          <Box>
            <Typography variant='h6' component='h5' color='aliceblue' mt={2}>Характеристики</Typography>

            {/* Feature List */}
            <Stack sx={{ display: 'grid', gridTemplateColumns: '250px 250px 250px', columnGap: 10 }}>
              {features.length
                ? features.map((feature) => <FeatureItem key={feature.id} feature={feature} onChange={handleChangeFeatures} />)
                : <Typography color='aliceblue'>Виберіть тип</Typography>}
            </Stack>
          </Box>

          <CloseSubmit
            onCreate={handleCreate}
            onClose={setIsCreateModal}
            submitText='Створити'
          />

        </Box>
      </Fade>
    </Modal>
  )
};

export default observer(AddProductModal);