export interface IOrderLine {
  productId: string;
  quantity: number;
  price: number;
}

export interface IContact {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface IShipping {
  method: string;
  city: string;
  address: string;
}


export interface IOrder {
  userId: string;
  contact: IContact;
  shipping: IShipping;
  products: IOrderLine[];
}

export interface ICustomer {
  userId: string;
  contact: {
    name: string;
    phoneNumber: string;
    email: string;
  },
  shipping: {
    method: string;
    city: string;
    address: string
  }
}

