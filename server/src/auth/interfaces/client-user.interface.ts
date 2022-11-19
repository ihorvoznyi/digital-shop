import { IAddress } from '../../address/interfaces';

type addressType = {
  homeDelivery: IAddress[];
  warehouseDelivery: IAddress[];
};

export interface IClientUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  addresses: addressType;
}
