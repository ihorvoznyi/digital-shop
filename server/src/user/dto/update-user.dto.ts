interface IAddress {
  city: string;
  home: string;
  postOffice: string;
}

export class UpdateUserDto {
  name: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
}
