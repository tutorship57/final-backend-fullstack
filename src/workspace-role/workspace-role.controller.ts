import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkspaceRoleService } from './workspace-role.service';
import { CreateWorkspaceRoleDto } from './dto/create-workspace-role.dto';
import { UpdateWorkspaceRoleDto } from './dto/update-workspace-role.dto';
import { Authorized } from 'src/auth/guards/authorized.decorator';

@Controller('users/:user_id/workspace/:workspace_id/roles')
// @Authorized('user', 'admin', 'superAdmin')
export class WorkspaceRoleController {
  constructor(private readonly workspaceRoleService: WorkspaceRoleService) {}

  @Post()
  create(
    @Param('workspace_id') workspaceId: string,
    @Param('user_id') userId: string,
    @Body('name') roleName: string, // Extract just the name from the body
  ) {
    return this.workspaceRoleService.create(workspaceId, userId, roleName);
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
  remove(@Param('id') id: string) {
    return this.workspaceRoleService.remove(id);
  }
}
