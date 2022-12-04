import { makeAutoObservable } from 'mobx';

class ModalStore {
  isEditModal: boolean = false;
  isCreateModal: boolean = false;
  isDeleteModal: boolean = false;

  editingId: string = '';

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }

  setIsEditModal(status: boolean, id: string) {
    this.isEditModal = status;
    this.isDeleteModal = false;
    this.isCreateModal = false;

    this.editingId = id;
  }

  setIsCreateModal(status: boolean) {
    this.isCreateModal = status;
    this.isDeleteModal = false;
    this.isEditModal = false;
  }

  setIsDeleteModal(status: boolean) {
    this.isDeleteModal = status;
    this.isEditModal = false;
    this.isCreateModal = false;
  }

  disableModals() {
    this.editingId = '';
    this.isEditModal = false;
    this.isCreateModal = false;
    this.isDeleteModal = false;
  }
}

export const modalStore = new ModalStore();
