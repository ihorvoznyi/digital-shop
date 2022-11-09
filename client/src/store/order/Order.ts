import { makeAutoObservable } from 'mobx';
import { IOrderLine } from './interfaces';

class OrderStore {
  readonly URL = 'http://localhost:8080/orders';

  constructor() {
    makeAutoObservable(this);
  }

  async createOrder(order: IOrderLine[]) {
    try {
      // const response = await axios.post(this.URL, order, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      // });
      return 200; // Status: 200 (success)
    } catch {
      return 400; // Bad Request
    }
  }

  getOrders() {}
}

export const orderStore = new OrderStore();
