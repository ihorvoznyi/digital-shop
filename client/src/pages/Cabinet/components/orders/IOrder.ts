import { IContact, IShipping } from "../../../../store/order/interfaces";

type ProductType = {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
};

interface IOrderProduct {
  product: ProductType;
  quantity: number;
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