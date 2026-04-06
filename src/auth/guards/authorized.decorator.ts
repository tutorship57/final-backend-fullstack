import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard'; // Import your JWT guard
import { ROLES_KEY, roleType } from './roles.decorator';

export const Authorized = (...roles: roleType[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard), // Order matters: Auth first, then Roles
  );
};
