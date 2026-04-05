import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { Authorized } from 'src/auth/guards/authorized.decorator';

@Controller('users/:user_id')
// @Authorized('user', 'admin', 'superAdmin')
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Post()
  create(@Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
    return this.workspaceMemberService.create(createWorkspaceMemberDto);
  }

  @Get()
  findAll() {
    return this.workspaceMemberService.findAll();
  }
  @Get('workspace/:workspaceId/members')
  findWorkspaceMembers(@Param('workspaceId') workspaceId: string) {
    return this.workspaceMemberService.findMembersWithRoles(workspaceId);
  }

  // --- NEW: Assign a role to a member ---
  @Patch('workspace/:workspaceId/member/:member_id/role')
  assignRole(
    @Param('workspace_id') workspaceId: string,
    @Param('user_id') userId: string,
    @Param('member_id') memberId: string,
    @Body('roleId') roleId: string,
  ) {
    return this.workspaceMemberService.assignRole(
      workspaceId,
      userId,
      memberId,
      roleId,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceMemberService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
  ) {
    return this.workspaceMemberService.update(id, updateWorkspaceMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceMemberService.remove(id);
  }
}
