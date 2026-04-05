import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceRepository } from './workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository],
  exports: [WorkspaceRepository],
})
export class WorkspaceModule {}
