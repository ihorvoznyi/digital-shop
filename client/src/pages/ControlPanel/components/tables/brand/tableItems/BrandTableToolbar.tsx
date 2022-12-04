import { useState } from 'react';

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
import { modalStore } from '../../../../../../store';
import { AddBrandModal, EditBrandModal } from '../modals';
import { deleteBrand, deleteType } from '../../../../../../store/general/services';
import { customization } from '../../product/Styles';
import { useLocation } from 'react-router-dom';

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedItems: readonly string[];
}

const BrandTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, selectedItems } = props;

  const { isEditModal, isCreateModal, setIsCreateModal, isDeleteModal, setIsDeleteModal } = modalStore;

  const { pathname } = useLocation();

  const route = pathname.split('/').slice(-1)[0];

  const handleDelete = async () => {
    for await (const id of selectedItems) {
      await deleteBrand(id);
    }

    setIsDeleteModal(false);

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
          <IconButton sx={{ color: 'aliceblue' }} onClick={() => setIsDeleteModal(true)}>
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
        open={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isDeleteModal}>
          <Box sx={customization.modalBox}>
            <Typography id="transition-modal-title" variant="h6" component="h2" color="aliceblue">
              Ви впевнені?
            </Typography>

            <Typography id="transition-modal-title" variant="body2" component="h6" color="aliceblue">
              Кількість вибраних об'єктів: {selectedItems.length}
            </Typography>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
              <Button variant='contained' onClick={handleDelete}>Підтвердити</Button>
              <Button variant='outlined' onClick={() => setIsDeleteModal(false)}>Скасувати</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {isCreateModal && route === 'brands' && (<AddBrandModal />)}
      {isEditModal && route === 'brands' && (<EditBrandModal />)}
    </Toolbar>
  );
}

export default observer(BrandTableToolbar);
