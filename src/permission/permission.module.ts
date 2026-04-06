import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { WorkspaceRole } from 'src/workspace-role/entities/workspace-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, WorkspaceRole, Workspace])],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
