import { makeAutoObservable } from 'mobx';
import { IType } from './interfaces/ITypes';
import { ShippingMethodEnum } from '../../pages/Order/components/shipping/enums/ShippingMethodEnum';

class GeneralStore {
  isLoading = true;
  openSection: null | string = null;
  types: IType[] = [];
  currentTypeId: string = '';
  tableValues = [];
  shippingMethod: ShippingMethodEnum = ShippingMethodEnum.POST_OFFICE;

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }

  setLoading(value: boolean) {
    this.isLoading = value;
  }

  setOpenSection(section: string | null) {
    this.openSection = section;
  }

  setTypes(types: IType[]) {
    this.types = types;
  }

  setCurrentType(id: string) {
    this.currentTypeId = id;
  }

  getTypes() {
    return [...this.types];
  }
}

export const generalStore = new GeneralStore();
