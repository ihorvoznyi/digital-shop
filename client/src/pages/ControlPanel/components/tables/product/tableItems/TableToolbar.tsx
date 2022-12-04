import { useState, useEffect } from 'react';

import {
  alpha,
  IconButton,
  Modal,
  Toolbar,
  Tooltip,
  Typography,
  Backdrop,
  Fade,
  Box,
  Button,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { observer } from 'mobx-react-lite';
import { customization } from '../Styles';
import AddProductModal from '../modals/AddProduct';
import { deleteProduct } from '../../../../../../store/product/ProductService';
import { EditProductModal } from '../modals';
import { modalStore } from '../../../../../../store';
import { useLocation } from 'react-router-dom';

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedItems: readonly string[];
}

const ProductTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, selectedItems } = props;

  const { isEditModal, isCreateModal, setIsCreateModal } = modalStore;

  const [isDeleteMenu, setIsDeleteMenu] = useState<boolean>(false);

  const { pathname } = useLocation();
  
  const route = pathname.split('/').slice(-1)[0];

  const handleDelete = async () => {
    for await (const id of selectedItems) {
      await deleteProduct(id);
    }

    setIsDeleteMenu(false);

    window.location.reload();
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            )
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='aliceblue'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
          color='aliceblue'
        >
          Товари
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton sx={{ color: 'aliceblue' }} onClick={() => setIsDeleteMenu(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Add new item'>
          <IconButton sx={{ color: 'aliceblue' }} onClick={() => setIsCreateModal(true)}>
            <AddBoxIcon />
          </IconButton>
        </Tooltip>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isDeleteMenu}
        onClose={() => setIsDeleteMenu(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isDeleteMenu}>
          <Box sx={customization.modalBox}>
            <Typography id="transition-modal-title" variant="h6" component="h2" color="aliceblue">
              Ви впевнені?
            </Typography>

            <Typography id="transition-modal-title" variant="body2" component="h6" color="aliceblue">
              Кількість вибраних об'єктів: {selectedItems.length}
            </Typography>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
              <Button variant='contained' onClick={handleDelete}>Підтвердити</Button>
              <Button variant='outlined' onClick={() => setIsDeleteMenu(false)}>Скасувати</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {isCreateModal && route === 'products' && (<AddProductModal />)}
      {isEditModal && route === 'products' && (<EditProductModal />)}
    </Toolbar>
  );
}

export default observer(ProductTableToolbar);
