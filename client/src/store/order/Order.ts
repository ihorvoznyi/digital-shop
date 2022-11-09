import { makeAutoObservable } from 'mobx';

class OrderStore {
  readonly URL = 'http://localhost:8080/orders';
  userOrders = [];

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }
}

export const orderStore = new OrderStore();
