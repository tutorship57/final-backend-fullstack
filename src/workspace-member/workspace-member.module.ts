import { Module } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceMember, Workspace, User])],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService],
  exports: [WorkspaceMemberService, TypeOrmModule],
})
export class WorkspaceMemberModule {}
