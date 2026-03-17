import { Module } from '@nestjs/common';
import { WorkspaceRoleService } from './workspace-role.service';
import { WorkspaceRoleController } from './workspace-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceRole } from './entities/workspace-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceRole])],
  controllers: [WorkspaceRoleController],
  providers: [WorkspaceRoleService],
})
export class WorkspaceRoleModule {}
