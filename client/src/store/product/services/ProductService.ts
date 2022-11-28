import axios from "axios";
import { addReviewType, IProduct } from "../interfaces";
import { productStore } from "../Product";

export const fetchProducts = async(limit: number = 10, page: number = 0) => {
  const URL = `${productStore.URL}?limit=${limit}&page=${page}`;

  try {
    const response = (await axios.get(URL));
    productStore.isLoading = true;
    productStore.products = response.data.data;

    return response.data.data;
  } catch {
    throw new Error('Error');
  } finally {
    productStore.isLoading = false;
  }
}

export const getProductsByType = async(typeId: string) => {
  try {
    productStore.isLoading = true;
    const url = `${productStore.URL}/type/${typeId}`;
    productStore.products = (await axios.get(url)).data;
  } catch {
    throw new Error('GET by Type: Error');
  } finally {
    productStore.isLoading = false;
  }
}

export const getProduct = async(id: string): Promise<IProduct> => {
  try {
    productStore.isLoading = true;
    const url = `${productStore.URL}/${id}`;
    const product = (await axios.get(url)).data;
    productStore.product = product;
    return product;
  } catch {
    throw new Error('GET Product: Error');
  } finally {
    productStore.isLoading = false;
  }
}

export const addReview = async(review: addReviewType) => {
  try {
    const url = `${productStore.URL}/reviews`;
    await axios.post(url, review, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  } catch {
    throw new Error('Add Comment: Error');
  }
}