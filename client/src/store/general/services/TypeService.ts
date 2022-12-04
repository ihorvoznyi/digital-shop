import axios from 'axios';
import { IEditType } from '../../../pages/ControlPanel/components/tables/type/interfaces';
import { INewType } from '../interfaces';

const URL = 'http://localhost:8080/types';

export const fetchTypes = async() => {
  try {
    const response = await axios.get(URL);

    return response.data;
  } catch {
    throw new Error('Global Error');
  } 
};

export const fetchType = async(id: string) => {
  try {
    const url = `${URL}/${id}`;
    const response = await axios.get(url);

    return response.data;
  } catch {
    throw new Error('GET Type: Error');
  }
};

export const fetchTableTypes = async() => {
  try {
    const url = `${URL}/for-table`;

    return (await axios.get(url)).data;
  } catch {
    return [];
  }
};

export const createType = async(params: INewType) => {
  try {
    const response = await axios.post(URL, params, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    return response.data;

  } catch {
    return false;
  }
};


export const deleteType = async (id: string) => {
  const url = `${URL}/${id}`;
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Beader ${localStorage.getItem(
          'token'
        )}`
      },
    });
  
    return response.data;
  } catch {
    throw new Error('Delete Type: Error');
  }
};

export const updateType = async(type: IEditType) => {
  const { id, ...other } = type;

  const url = `${URL}/${id}`;

  try {
    const response = await axios.put(url, other, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    return response.data;
  } catch {
    return false;
  }
};

export const validateType = async(option: string, value: string) => {
  const url = `${URL}/validate`;

  try {
    await axios.post(url, {
      option,
      value,
    });

    return true;
  } catch {
    return false;
  }
};