import { UserRolesEnum } from '../../user/enums';

type addressType = {
  id: string;
  city: string;
  street: string;
  unitNumber: string;
  postalCode: string;
};

export interface IClientUser {
  id: string;
  email: string;
  role: UserRolesEnum;
  phoneNumber: string;
  address: addressType;
}
