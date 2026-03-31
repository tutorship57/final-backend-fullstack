import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { roleType } from './roles.decorator';

export const Authorized = (...roles: roleType[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(GoogleAuthGuard, RolesGuard),
  );
};
