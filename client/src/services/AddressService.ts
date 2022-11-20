import axios from "axios";
import { userStore } from "../store";

import { INewAddress } from "../store/user/interfaces";

const URL = 'http://localhost:8080/address';

export const createAddress = async (newAddress: INewAddress) => {
  try {
    const url = `${URL}/${userStore.user.id}`;
    const response = await axios.post(url, newAddress);

    console.log(response.data);
    
  } catch (err) {
    console.log(err);
  }
}