import { makeAutoObservable } from "mobx";
import axios from "axios";
import { IWarehouses } from "./interfaces/IWarehouses";

class ShippingStore {
  private readonly API_KEY = 'e17f15fb792d3d57c4d2d5dacfa92c15';
  private readonly ENTRY_POINT = 'https://api.novaposhta.ua/v2.0/json/';

  warehouses: string[] = [];
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getWarehouses(city: string) {
    const response: IWarehouses  = (await axios.post(this.ENTRY_POINT, {
      apiKey: this.API_KEY,
      modelName: 'Address',
      calledMethod: "getWarehouses",
      methodProperties: {
        CityName: city,
      }
    })).data;

    const data = response.data.map((item) => item.Description);
    this.warehouses = [...data];
  }

  setIsOpen(state: boolean) {
    this.isOpen = state;
  }
}

export const shippingStore = new ShippingStore();
