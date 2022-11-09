import { IClientUser } from './client-user.interface';

export interface IAuth {
  email: string;
  sub: string;
}

export interface IAuthReturn {
  token: string;
  user: IClientUser;
}
