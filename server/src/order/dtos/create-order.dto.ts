import { IOrderLine } from '../interfaces';

export class CreateOrderDto {
  userId: string;
  orderLineList: IOrderLine[];
}
