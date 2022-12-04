import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../FirebaseConfig';

import { addReviewType, IProduct, INewProduct, IUpdateProduct } from './interfaces';

import { productStore } from './Product';

const URL = 'http://localhost:8080/products';

export const fetchProducts = async (limit: number = 10, page: number = 0) => {
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

export const getInitial = async () => {
  try {
    productStore.isLoading = true;

    const response = await axios.get(URL);

    productStore.products = response.data;
  } catch {
    throw new Error('GET Initial Product: Error');
  } finally {
    productStore.isLoading = false;
  }
}

export const getProductsByType = async (typeId: string) => {
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

export const getProduct = async (id: string): Promise<IProduct> => {
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

export const fetchTableProducts = async () => {
  try {
    const url = `${URL}/for-table`;

    return (await axios.get(url)).data;
  } catch {
    throw new Error('GET Products: Error');
  }
};

export const addReview = async (review: addReviewType) => {
  try {
    const url = `${URL}/reviews`;
    await axios.post(url, review, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  } catch {
    throw new Error('Add Comment: Error');
  }
};

export const createProduct = async (product: INewProduct) => {
  let iconUrl: string = '';


  try {
    if (product.image) {
      iconUrl = await createImageURL(product.image);
    }

    const response = await axios.post(URL, {
      ...product,
      image: iconUrl,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    return response.data;
  } catch {
    throw new Error('Create Product: Error');
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const url = `${URL}/${id}`;
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    return response.data;
  } catch {
    throw new Error('Delete Product: Error');
  }
}

export const updateProduct = async (product: IUpdateProduct) => {
  const { id, type, ...other } = product;

  const url = `${URL}/${id}`;

  let imageUrl: string = product.oldImage;

  try {
    if (product.image !== product.oldImage) {
      await deleteImageURL(product.oldImage);

      imageUrl = await createImageURL(product.image);
    }

    const response = await axios.put(url, {
      ...other,
      image: imageUrl,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    return response.data;
  } catch {
    throw new Error('Update Product: Error');
  }
};

export const validateProduct = async (name: string) => {
  const url = `${URL}/validate`;

  try {
    const response = (await axios.post(url, { name: name })).data;

    return response;
  } catch {
    return false;
  }
};

const createImageURL = async (image: any) => {
  const name = image.name.split('.').slice(0, -1)[0];
  const suffix = name + '-' + Math.round(Math.random() * 1e9);

  const storageRef = ref(storage, `images/${suffix}`);
  await uploadBytesResumable(storageRef, image as any);

  return (await getDownloadURL(storageRef));
};

const deleteImageURL = async (image: any): Promise<boolean> => {
  let status: boolean = true;

  const desertRef = ref(storage, `images/${image.name}`);
  await deleteObject(desertRef)
    .then(() => status = true)
    .catch(() => status = false);

  return status;
};