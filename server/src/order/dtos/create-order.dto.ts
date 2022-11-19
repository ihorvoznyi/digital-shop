import { IOrderLine } from '../interfaces';

interface IContact {
  name: string;
  phone: string;
  email: string;
}

interface IShipping {
  method: string;
  city: string;
  address: string;
}

export class CreateOrderDto {
  userId?: string;
  contact: IContact;
  shipping: IShipping;
  products: IOrderLine[];
}
