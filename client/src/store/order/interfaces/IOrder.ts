export interface IOrderLine {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICustomerDetails {
  userId: string;
  contact: {
    name: string;
    phone: string;
    email?: string;
  },
  shipping: {
    method: string;
    shippingAddress: {
      city: string;
      address: string
    }
  }
}

export interface ICustomer {
  userId: string;
  name: string;
  phone: string;
  email: string;
  method: string;
  city: string;
  address: string;
}
