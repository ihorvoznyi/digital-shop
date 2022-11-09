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
}

export const productStore = new ProductStore();
