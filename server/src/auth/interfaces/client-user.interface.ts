type addressType = {
  city: string;
  home: string;
  postOffice: string;
};

export interface IClientUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  address: addressType;
}
