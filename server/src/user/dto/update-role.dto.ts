import { UserRolesEnum } from '../enums';

export class UpdateRoleDto {
  userId: string;
  role: UserRolesEnum;
}
