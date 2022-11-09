import { IProduct } from '../../product/interfaces';

export interface CartItem {
  product: IProduct;
  quantity: number;
}
