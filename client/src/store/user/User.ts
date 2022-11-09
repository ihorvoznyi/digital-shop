import { ILogin, IRegistration, IUser } from "./interfaces";
import { makeAutoObservable } from "mobx";
import axios from "axios";

const AUTH_URL = 'http://localhost:8080/auth';

const initialState = {
  user: {
    id: '',
    email: '',
    role: '',
    phoneNumber: '',
    address: {
      id: '',
      city: '',
      street: '',
      unitNumber: '',
      postalCode: '',
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

  logout() {
    this.user = initialState.user;
    this.isAuth = false;

    localStorage.removeItem('token');
  }
}

export const userStore = new UserStore();
