import { IAddress } from "./IAddress";

export interface IUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
}

export interface IUpdateUser {
  name: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
}