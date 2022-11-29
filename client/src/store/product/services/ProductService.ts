import axios from 'axios';

import { addReviewType, IProduct } from '../interfaces';

import { productStore } from '../Product';

const URL = 'http://localhost:8080/products';

export const fetchProducts = async(limit: number = 10, page: number = 0) => {
  const url = `${URL}?limit=${limit}&page=${page}`;

  try {
    const response = (await axios.get(url));
    productStore.isLoading = true;
    productStore.products = response.data.data;

    return response.data.data;
  } catch {
    throw new Error('Error');
  } finally {
    productStore.isLoading = false;
  }
};

export const getProductsByType = async(typeId: string) => {
  try {
    productStore.isLoading = true;
    const url = `${URL}/type/${typeId}`;
    productStore.products = (await axios.get(url)).data;
  } catch {
    throw new Error('GET by Type: Error');
  } finally {
    productStore.isLoading = false;
  }
};

export const getProduct = async(id: string): Promise<IProduct> => {
  try {
    productStore.isLoading = true;
    const url = `${URL}/${id}`;
    const product = (await axios.get(url)).data;
    productStore.product = product;
    return product;
  } catch {
    throw new Error('GET Product: Error');
  } finally {
    productStore.isLoading = false;
  }
};

export const fetchTableProducts = async() => {
  try {
    const url = `${URL}/for-table`;

    return (await axios.get(url)).data;
  } catch {
    throw new Error('GET Products: Error');
  }
};

export const addReview = async(review: addReviewType) => {
  try {
    const url = `${URL}/reviews`;
    await axios.post(url, review, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  } catch {
    throw new Error('Add Comment: Error');
  }
};