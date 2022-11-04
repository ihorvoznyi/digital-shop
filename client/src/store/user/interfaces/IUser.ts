import { IAddress } from "./IAddress";

export interface IUser {
  id: string;
  email: string;
  phoneNumber: string;
  role: string;
  address?: IAddress;
}
