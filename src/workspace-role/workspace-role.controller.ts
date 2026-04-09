import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceRoleService } from './workspace-role.service';
import { CreateWorkspaceRoleDto } from './dto/create-workspace-role.dto';
import { UpdateWorkspaceRoleDto } from './dto/update-workspace-role.dto';
import { PermissionGuard } from 'src/permission/guards/permission.guard';
import { Authorized } from 'src/auth/guards/authorized.decorator';

@Controller('users/:user_id/workspace/:workspace_id/roles')
@Authorized('user', 'admin', 'company')
export class WorkspaceRoleController {
  constructor(private readonly workspaceRoleService: WorkspaceRoleService) {}

  @Post()
  @UseGuards(PermissionGuard('Manage-Role'))
  create(
    @Param('workspace_id') workspaceId: string,
    @Param('user_id') userId: string,
    @Body() createDto: CreateWorkspaceRoleDto,
  ) {
    // Manually assign the ID from the URL to the DTO
    createDto.workspace_id = workspaceId;
    return this.workspaceRoleService.create(workspaceId, userId, createDto);
  }

  @Get()
  // @UseGuards(PermissionGuard('Manage-Role'))
  findAll(@Param('workspace_id') workspaceId: string) {
    return this.workspaceRoleService.findAll(workspaceId);
  }

  @Get('member-role')
  findMemberRole(
    @Param('workspace_id') workspaceId: string,
    @Param('user_id') userId: string,
  ) {
    return this.workspaceRoleService.findMemberRole(workspaceId, userId);
  }

  @Get(':id')
  @UseGuards(PermissionGuard('Manage-Role'))
  findOne(@Param('id') id: string) {
    return this.workspaceRoleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard('Manage-Role'))
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceRoleDto: UpdateWorkspaceRoleDto,
  ) {
    return this.workspaceRoleService.update(id, updateWorkspaceRoleDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard('Manage-Role'))
  remove(@Param('id') id: string) {
    return this.workspaceRoleService.remove(id);
  }
}
