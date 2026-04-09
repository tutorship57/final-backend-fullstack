// src/permission/guards/permission.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { Repository } from 'typeorm';

export const PermissionGuard = (
  ...requiredPermissions: string[]
): Type<CanActivate> => {
  @Injectable()
  class PermissionGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(Workspace)
      private readonly workspaceRepo: Repository<Workspace>,
      @InjectRepository(WorkspaceMember)
      private readonly memberRepo: Repository<WorkspaceMember>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      // 1. Get user data from JWT
      const user = request.user;
      if (!user || !user.userId) {
        throw new UnauthorizedException('User not authenticated via token');
      }

      // 2. GLOBAL BYPASS: Admin/Company check
      if (user.role === 'admin' || user.role === 'company') {
        return true;
      }

      // 3. Extract Workspace ID from URL
      const workspaceId =
        request.params.workspace_id || request.params.workspaceId;
      if (!workspaceId) {
        throw new ForbiddenException(
          'Workspace ID missing in request parameters',
        );
      }

      // 4. OWNER BYPASS
      const workspace = await this.workspaceRepo.findOne({
        where: { id: workspaceId },
      });
      if (workspace && workspace.owner_id === user.userId) {
        return true;
      }

      // 5. DETAILED PERMISSION CHECK (NEW LOGIC)
      // Fetch the member, including all their roles, and the permissions on those roles
      const member = await this.memberRepo.findOne({
        where: {
          user_id: user.userId,
          workspace_id: workspaceId,
        },
        relations: ['roles', 'roles.permissions'], // Safely fetches the ManyToMany data
      });

      // If they aren't even a member
      if (!member) {
        console.log(
          `[GUARD BLOCK] User ${user.userId} is not a member of Workspace ${workspaceId}`,
        );
        throw new ForbiddenException('You are not a member of this workspace.');
      }

      // Extract all permission names from all roles the user has in this workspace
      const userPermissions: string[] = [];
      if (member.roles) {
        for (const role of member.roles) {
          if (role.permissions) {
            for (const perm of role.permissions) {
              userPermissions.push(perm.name);
            }
          }
        }
      }

      // DEBUGGING: This will print in your NestJS terminal so you can see exactly what is happening
      console.log(`-----------------------------------------`);
      console.log(`[GUARD CHECK] User: ${user.email}`);
      console.log(`[GUARD CHECK] Route Requires:`, requiredPermissions);
      console.log(`[GUARD CHECK] User Has Permissions:`, userPermissions);
      console.log(`-----------------------------------------`);

      // Check if the user has AT LEAST ONE of the required permissions
      const hasPermission = requiredPermissions.some((reqPerm) =>
        userPermissions.includes(reqPerm),
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `You do not have the required workspace permissions: ${requiredPermissions.join(' or ')}`,
        );
      }

      return true;
    }
  }

  return mixin(PermissionGuardMixin);
};
