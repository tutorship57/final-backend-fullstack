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

@Controller('users/:user_id/workspace/:workspace_id/roles')
// @Authorized('user', 'admin', 'superAdmin')
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
  findAll(@Param('workspace_id') workspaceId: string) {
    return this.workspaceRoleService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceRoleService.findOne(id);
  }

  @Patch(':id')
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
