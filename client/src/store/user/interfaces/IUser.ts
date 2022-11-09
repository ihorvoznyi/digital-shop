import { IAddress } from "./IAddress";

type addressType = {
  homeDelivery: IAddress[];
  warehouseDelivery: IAddress[];
}

export interface IUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  addresses: addressType;
}

export interface IUpdateUser {
  name: string;
  email: string;
  phoneNumber: string;
}