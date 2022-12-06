import { useRef, useState, useCallback, useEffect } from 'react';
import { Backdrop, Box, Fade, Modal, Stack, Typography } from '@mui/material';

import { customization } from '../Styles';

import ImageIcon from '@mui/icons-material/Image';
import { IType } from '../../../../../../store/general/interfaces';
import { IProduct, IProductFeature, IUpdateProduct } from '../../../../../../store/product/interfaces';
import { getProduct, updateProduct } from '../../../../../../store/product/ProductService';
import { CloseSubmit, FeatureEditItem } from './components';
import { fetchType } from '../../../../../../store/general/services';
import { observer } from 'mobx-react-lite';
import FormToEdit from './components/edit/FormToEdit';
import { modalStore } from '../../../../../../store';
import { IEditProduct } from '../interfaces';
import { Loader } from '../../../../../../components';

const EditProductModal = () => {
  const { isEditModal, setIsEditModal } = modalStore;

  const [productFeatures, setProductFeatures] = useState<IProductFeature[]>([]);

  const [product, setProduct] = useState<IEditProduct>({
    id: '',
    name: '',
    description: '',
    image: '',
    oldImage: '',
    isActive: true,
    type: '',
    brand: {
      id: '',
      name: '',
    },
    price: '',
    features: [],
  });

  const [image, setImage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = () => {
    const { name, description, brand, price } = product;

    if (!name || !description || !brand || !price) return;

    const isNotFilled = productFeatures.map((feature) => !feature.value).includes(true);

    if (isNotFilled) return;

    const list = product.features.map((feature) => ({ id: feature.id, value: feature.value }))

    updateProduct({
      ...product,
      brand: product.brand.id,
      price: parseFloat(product.price),
      features: list,
    }).then((status: boolean) => {
      if (status) {
        setIsEditModal(false, '');
        window.location.reload();
      }
    });
  };

  const handleClose = () => {
    setIsEditModal(false, '');
  }

  const handleUpload = (event: any) => {
    const file = event.target.files[0];

    setImage(URL.createObjectURL(file));
    setProduct((prev) => ({ ...prev, image: file }));
  };

  const handleChangeFeatures = (id: string, value: string) => {
    const list = productFeatures.filter((feature) => {
      if (feature.id === id) {
        feature.value = value;

        return feature;
      }

      return feature;
    });

    setProductFeatures(list);
  };

  const handleProductChange = (name: string, value: string) => {
    const key = name as keyof IUpdateProduct;

    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelect = (select: string, value: string) => {
    if (select === 'brand') setProduct((prev) => ({
      ...prev, brand: {
        ...prev.brand,
        id: value,
      }
    }));
    else if (select === 'type') {
      setProduct((prev) => ({ ...prev, type: value }));
      fetchType(value).then((data: IType) => {
        const featuresWithValue = data.features.map((feature) => ({ id: feature.id, value: '' }));

        setProductFeatures(featuresWithValue);
      });
    } else {
      let status: boolean;

      if (value === 'active') status = true;
      else status = false;

      setProduct((prev) => ({ ...prev, isActive: status }));
    }
  };

  useEffect(() => {
    getProduct(modalStore.editingId).then((data: IProduct) => {
      const updateFeatures = data.features.map((feature) => {
        return {
          id: feature.id,
          name: feature.feature,
          value: feature.value + '',
        }
      });

      setProduct({
        id: data.id,
        name: data.name,
        description: data.description,
        image: data.image,
        oldImage: data.image,
        isActive: data.isActive,
        brand: {
          id: data.brand.id,
          name: data.brand.name,
        },
        type: data.type.id,
        price: data.price + '',
        features: updateFeatures,
      });

      setImage(data.image);

      setProductFeatures(updateFeatures);
    });
  }, []);

  if (!product.id) return <Loader />

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={isEditModal}
      onClose={() => {
        setIsEditModal(false, '');
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isEditModal}>
        <Box sx={customization.modalBox}>
          <Typography id='transition-modal-title' variant='h6' component='h2' color='aliceblue' mb={1}>
            Редагувати товар
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
            <FormToEdit product={product} onChange={handleProductChange} onSelect={handleSelect} />

          </Stack>

          {/* Features Box */}
          <Box>
            <Typography variant='h6' component='h5' color='aliceblue' mt={2}>Характеристики</Typography>

            {/* Feature List */}
            {product.features.length && (
              <Stack sx={{ display: 'grid', gridTemplateColumns: '250px 250px 250px', columnGap: 10 }}>
                {product.features.map((feature) => <FeatureEditItem key={feature.id} feature={feature} onChange={handleChangeFeatures} />)}
              </Stack>
            )}

          </Box>

          <CloseSubmit
            onCreate={handleUpdate}
            onClose={handleClose}
            submitText={'Редагувати'}
          />

        </Box>
      </Fade>
    </Modal>
  )
};

export default observer(EditProductModal);