import { makeAutoObservable } from "mobx";
import axios from "axios";
import { ITypes } from "./interfaces/ITypes";
import { ShippingMethodEnum } from "../../pages/Order/components/shipping/enums/ShippingMethodEnum";

class GeneralStore {
  isLoading = true;
  openSection: null | string = null;
  types: ITypes[] = [];
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
}

export const generalStore = new GeneralStore();
