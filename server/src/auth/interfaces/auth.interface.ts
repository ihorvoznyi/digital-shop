import { User } from '../../database/entities';

export interface IAuth {
  email: string;
  sub: string;
}

export interface IAuthReturn {
  token: string;
  user: User;
}
