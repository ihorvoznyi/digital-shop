type addressType = {
  id: string;
  method: string;
  city: string;
  address: string;
};

export interface IClientUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  addresses: addressType[];
}
