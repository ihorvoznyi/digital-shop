import { IAddress } from "./IAddress";

export interface IUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  addresses: IAddress;
}
