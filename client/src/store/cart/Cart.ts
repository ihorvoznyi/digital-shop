import { IProduct } from '../product/interfaces';
import { makeAutoObservable } from 'mobx';
import { CartItem } from './interfaces';

class CartStore {
  cart: CartItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addToCart(product: IProduct) {
    const candidate = this.cart.find((item) => item.product.id === product.id);

    if (candidate) {
      candidate.quantity++;
      return;
    }

    this.cart = [...this.cart, { product, quantity: 1 }];
  }

  removeOne(id: string) {
    const candidate = this.cart.find((item) => item.product.id === id);

    if (!candidate) return;

    if (candidate.quantity === 1) {
      this.removeFromCart(id);
      return;
    }

    candidate.quantity--;
  }

  removeFromCart(id: string) {
    this.cart = this.cart.filter((item) => item.product.id !== id);
  }

  clear() {
    this.cart = [];
  }
}

export const cartStore = new CartStore();
