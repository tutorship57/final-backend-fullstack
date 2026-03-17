import { RoleEnum } from './role';
export interface UserQueryFilters {
  id?: string;
  email?: string;
  name?: string;
  picture_url?: string;
  role?: RoleEnum;
  sortBy?: string;
  sortOrder?: string;
  limit?: number; //amount
  offset?: number; //beginning
}

export interface userFindOneQuery {
  id?: string;
  email?: string;
  name?: string;
  picture_url?: string;
  role?: RoleEnum;
}
