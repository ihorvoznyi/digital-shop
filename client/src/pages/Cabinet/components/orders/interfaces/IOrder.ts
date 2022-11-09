import { IContact, IShipping } from "../../../../../store/order/interfaces";

interface IOrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
};

export interface IOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  products: IOrderProduct[];
  contact: IContact;
  shipping: IShipping;
};