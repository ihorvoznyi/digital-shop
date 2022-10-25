import { UserRolesEnum } from '../enums';

export class CreateUserDto {
  phoneNumber: string;
  email: string;
  password: string;
  role: UserRolesEnum;
}
