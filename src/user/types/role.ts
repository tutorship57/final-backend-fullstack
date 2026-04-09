import { roleType } from 'src/auth/guards/roles.decorator';

export type Role = roleType;

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  COMPANY = 'company',
}
