// src/permission/permission.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  mixin,
  Type,
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

      // Extract IDs from request params based on your controller structure
      const userId = request.params.user_id;
      const workspaceId =
        request.params.workspace_id || request.params.workspaceId;

      if (!userId || !workspaceId) {
        throw new ForbiddenException('User or Workspace ID missing in request');
      }

      // 1. OWNER BYPASS: Check if the user is the workspace owner
      const workspace = await this.workspaceRepo.findOne({
        where: { id: workspaceId },
      });

      if (workspace && workspace.owner_id === userId) {
        return true;
      }

      // 2. PERMISSION CHECK: Check if the member has ANY of the required permissions
      // We join: member -> roles -> permissions
      const memberWithPermissions = await this.memberRepo
        .createQueryBuilder('member')
        .innerJoin('member.roles', 'role')
        .innerJoin('role.permissions', 'permission')
        .where('member.user_id = :userId', { userId })
        .andWhere('member.workspace_id = :workspaceId', { workspaceId })
        .andWhere('permission.name IN (:...requiredPermissions)', {
          requiredPermissions,
        })
        .getOne();

      if (!memberWithPermissions) {
        throw new ForbiddenException(
          `Missing required permissions: ${requiredPermissions.join(' or ')}`,
        );
      }

      return true;
    }
  }

  return mixin(PermissionGuardMixin);
};
