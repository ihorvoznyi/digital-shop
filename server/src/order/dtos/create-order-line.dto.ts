import { UserOrder } from '../../database/entities';

export class CreateOrderLineDto {
  order: UserOrder;
  productId: string;
  quantity: number;
  price: number;
}
