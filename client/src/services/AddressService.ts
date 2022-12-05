import axios from 'axios';
import { userStore } from '../store';

import { INewAddress } from '../store/user/interfaces';

const URL = 'http://localhost:8080/address';

export const createAddress = async (newAddress: INewAddress) => {
  try {
    const url = `${URL}/${userStore.user.id}`;
    const response = await axios.post(url, newAddress);

    return response.data;
    
  } catch (err) {
    throw new Error('Create Address: Error');
  }
}

export const deleteAddress = async (addressId: string) => {
  try {
    const url = `${URL}/${addressId}`;
    await axios.delete(url);
  } catch (err) {
    throw new Error('Delete Address: Error');
  }
}