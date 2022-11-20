import { makeAutoObservable } from "mobx";

class ShippingStore {
  warehouses: string[] = [];

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }

  getWarehouses() {
    return [...this.warehouses];
  }
}

export const shippingStore = new ShippingStore();
