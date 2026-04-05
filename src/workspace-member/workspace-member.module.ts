import { Module } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { Workspace } from 'src/workspace/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceMember, Workspace])],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
