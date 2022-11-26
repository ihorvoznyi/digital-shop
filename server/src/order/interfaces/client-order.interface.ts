import { IAddress } from 'src/address/interfaces';
import { IOrderLine } from './order-line.interface';

interface IContact {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface IClientOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  products: IOrderLine[];
  contact: IContact;
  shipping: IAddress;
}
