import { makeAutoObservable } from 'mobx';
import { ICustomer, IOrderLine } from './interfaces';
import { userStore } from "../user/User";

const initialState = {
  customerDetails: {
    userId: userStore.user.id,
    name: '',
    phone: '',
    email: '',
    method: '',
    city: '',
    address: '',
  }
}

class OrderStore {
  readonly URL = 'http://localhost:8080/orders';
  customer: ICustomer = initialState.customerDetails;

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

  setData(key: string, value: string) {
    this.customer[key as keyof ICustomer] = value;
  }

  showCustomer() {
    console.log(this.customer);
  }
}

export const orderStore = new OrderStore();
