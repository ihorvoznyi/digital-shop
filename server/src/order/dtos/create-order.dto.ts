import { IOrderLine } from '../interfaces';

interface IContact {
  name: string;
  phone: string;
  email: string;
}

export class CreateOrderDto {
  userId?: string;
  contact: IContact;
  products: IOrderLine[];
}
