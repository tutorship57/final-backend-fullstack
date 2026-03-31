import { SetMetadata } from '@nestjs/common';

export type roleType = 'admin' | 'user' | 'superAdmin';
// This string 'roles' is the key we will use to look up metadata later
export const ROLES_KEY = 'roles';
export const Roles = (...roles: roleType[]) => SetMetadata(ROLES_KEY, roles);
