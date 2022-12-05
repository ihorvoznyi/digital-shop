import { makeAutoObservable } from 'mobx';
import { IProduct } from './interfaces';

class ProductStore {
  products: IProduct[] = [];
  product: IProduct | null = null;
  isLoading = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setProducts(products: IProduct[]) {
    this.products = products;
  }
}

export const productStore = new ProductStore();
