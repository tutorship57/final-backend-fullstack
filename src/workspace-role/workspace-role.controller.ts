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

@Controller('workspace-role')
@Authorized('user', 'admin', 'superAdmin')
export class WorkspaceRoleController {
  constructor(private readonly workspaceRoleService: WorkspaceRoleService) {}

  @Post()
  create(@Body() createWorkspaceRoleDto: CreateWorkspaceRoleDto) {
    return this.workspaceRoleService.create(createWorkspaceRoleDto);
  }

  @Get()
  findAll() {
    return this.workspaceRoleService.findAll();
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
