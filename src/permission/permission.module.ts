import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { WorkspaceRole } from 'src/workspace-role/entities/workspace-role.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      WorkspaceRole,
      Workspace,
      WorkspaceMember,
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [TypeOrmModule],
})
export class PermissionModule {}
