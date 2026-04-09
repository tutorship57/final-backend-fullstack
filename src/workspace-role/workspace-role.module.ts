import { Module } from '@nestjs/common';
import { WorkspaceRoleService } from './workspace-role.service';
import { WorkspaceRoleController } from './workspace-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceRole } from './entities/workspace-role.entity';

import { Workspace } from 'src/workspace/entities/workspace.entity';
import { WorkspaceMemberModule } from 'src/workspace-member/workspace-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceRole, Workspace]),
    WorkspaceMemberModule,
  ],
  controllers: [WorkspaceRoleController],
  providers: [WorkspaceRoleService],
  exports: [WorkspaceRoleService],
})
export class WorkspaceRoleModule {}
