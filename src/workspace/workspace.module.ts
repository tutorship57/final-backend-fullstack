import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { WorkspaceMemberModule } from 'src/workspace-member/workspace-member.module';
import { WorkspaceRoleModule } from 'src/workspace-role/workspace-role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    WorkspaceMemberModule,
    WorkspaceRoleModule, // Add this so WorkspaceRoleService is available
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository],
  exports: [WorkspaceRepository],
})
export class WorkspaceModule {}
