import { ILogin, IRegistration, IUser, IUpdateUser, INewAddress } from "./interfaces";
import { makeAutoObservable } from "mobx";
import axios from "axios";
import { AddressEnum } from "../shipping/enums";

const AUTH_URL = 'http://localhost:8080/auth';
const USER_URL = 'http://localhost:8080/users';

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

  async auth() {
    try {
      this.setLoading(true);
      const url = AUTH_URL + '/auth';
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { user } = response.data;

      this.user = user as IUser;
      this.isAuth = true;
    } catch {
      throw new Error('Auth Error');
    } finally {
      this.setLoading(false);
    }
  }

  async login({ email, password }: ILogin) {
    try {
      this.setLoading(true);
      const url = AUTH_URL + '/login';
      const response = await axios.post(url, {
        email,
        password,
      });

      const { user, token } = response.data;

      this.user = user as IUser;
      this.isAuth = true;
      localStorage.setItem('token', token);
    } catch {
      throw new Error('Login Error');
    } finally {
      this.setLoading(false);
    }
  }

  async registration({ phoneNumber, password, email }: IRegistration) {
    try {
      this.setLoading(true);
      const url = AUTH_URL + '/registration';
      const response = await axios.post(url, {
        email,
        password,
        phoneNumber,
      });

      const { user, token } = response.data;

      this.user = user as IUser;
      this.isAuth = true;
      localStorage.setItem('token', token);
    } catch {
      throw new Error('Registration Error');
    } finally {
      this.setLoading(false);
    }
  }

  async updateUser(updateInfo: IUpdateUser) {
    const url = `${USER_URL}/${this.user.id}`;

    try {
      const response = await axios.put(url, updateInfo, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { user, token } = response.data;
  
      if (token) localStorage.setItem('token', token);
  
      this.user = user;
    } catch (err) {
      console.log(err);
    }
  }

  async checkIsAvailable(email: string) {
    const url = `${USER_URL}/validate-email`;

    try {
      await axios.post(url, { email });

      return true;
    } catch {
      return false;
    }
  }

  async createAddress(newAddress: INewAddress) {
    const url = `http://localhost:8080/address/${this.user.id}`;
    try {
      const response = await axios.post(url, newAddress);

      this.user.addresses = response.data;
    } catch {
      //
    }
  }

  logout() {
    this.user = initialState.user;
    this.isAuth = false;

    localStorage.removeItem('token');
  }
}

export const userStore = new UserStore();
