import { makeAutoObservable } from "mobx";

import { IUser, } from "./interfaces";

const initialState = {
  user: {
    id: '',
    name: '',
    role: '',
    email: '',
    phoneNumber: '',
    addresses: {
      homeDelivery: [],
      warehouseDelivery: [],
    }
  },
}

export class UserStore {
  user: IUser = initialState.user;
  isAuth = false;
  isLoading = true;

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }

  setLoading(value: boolean) {
    this.isLoading = value;
  }

  logout() {
    this.user = initialState.user;
    this.isAuth = false;

    localStorage.removeItem('token');
  }
}

export const userStore = new UserStore();
