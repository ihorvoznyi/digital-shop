import axios from "axios";
import { ILogin, IRegistration, IUser } from "../interfaces";
import { userStore } from "../User";

const AUTH_URL = 'http://localhost:8080/auth';

export const auth = async() => {
  try {
    userStore.setLoading(true);
    const url = AUTH_URL + '/auth';
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const { user } = response.data;

    userStore.user = user as IUser;
    userStore.isAuth = true;
  } catch {
    throw new Error('Auth Error');
  } finally {
    userStore.setLoading(false);
  }
}

export const login = async({ email, password }: ILogin) => {
  try {
    userStore.setLoading(true);
    const url = AUTH_URL + '/login';
    const response = await axios.post(url, {
      email,
      password,
    });

    const { user, token } = response.data;

    userStore.user = user as IUser;
    userStore.isAuth = true;
    localStorage.setItem('token', token);
  } catch {
    throw new Error('Login Error');
  } finally {
    userStore.setLoading(false);
  }
}

export const registration = async({ phoneNumber, password, email }: IRegistration) => {
  try {
    userStore.setLoading(true);
    const url = AUTH_URL + '/registration';
    const response = await axios.post(url, {
      email,
      password,
      phoneNumber,
    });

    const { user, token } = response.data;

    userStore.user = user as IUser;
    userStore.isAuth = true;
    localStorage.setItem('token', token);
  } catch {
    throw new Error('Registration Error');
  } finally {
    userStore.setLoading(false);
  }
}