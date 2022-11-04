import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { addReviewType, IProduct } from './interfaces';

class ProductStore {
  readonly URL = 'http://localhost:8080/products';

  products: IProduct[] = [];
  product: IProduct | null = null;
  isLoading = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchProducts() {
    try {
      this.isLoading = true;
      this.products = (await axios.get(this.URL)).data;
    } catch {
      throw new Error('Error');
    } finally {
      this.isLoading = false;
    }
  }

  async getProductsByType(typeId: string) {
    try {
      this.isLoading = true;
      const url = `${this.URL}/type/${typeId}`;
      this.products = (await axios.get(url)).data;
    } catch {
      throw new Error('GET by Type: Error');
    } finally {
      this.isLoading = false;
    }
  }

  async getProduct(id: string): Promise<IProduct> {
    try {
      this.isLoading = true;
      const url = `${this.URL}/${id}`;
      const product = (await axios.get(url)).data;
      this.product = product;
      return product;
    } catch {
      throw new Error('GET Product: Error');
    } finally {
      this.isLoading = false;
    }
  }

  async addReview(review: addReviewType) {
    try {
      const url = `${this.URL}/reviews`;
      await axios.post(url, review, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch {
      throw new Error('Add Comment: Error');
    }
  }
}

export const productStore = new ProductStore();
