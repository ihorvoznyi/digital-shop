import axios from "axios";

import { IUpdateUser } from "../interfaces";

import { userStore } from "../User";

const USER_URL = 'http://localhost:8080/users';

export const updateUser = async (updateInfo: IUpdateUser) => {
  const url = `${USER_URL}/${userStore.user.id}`;

    try {
      const response = await axios.put(url, updateInfo, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { user, token } = response.data;
  
      if (token) localStorage.setItem('token', token);
  
      userStore.user = user;
    } catch (err) {
      console.log(err);
    }
}

export const checkIsAvailable = async(email: string) => {
  const url = `${USER_URL}/validate-email`;

  try {
    await axios.post(url, { email });

    return true;
  } catch {
    return false;
  }
}