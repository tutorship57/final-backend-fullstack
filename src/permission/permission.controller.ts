import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('users/:user_id/workspace/:workspace_id/permissions')
  async getUserPermissions(
    @Param('user_id') userId: string,
    @Param('workspace_id') workspaceId: string,
  ) {
    return this.permissionService.findUserPermissions(userId, workspaceId);
  }

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get('permissions')
  findAll() {
    return this.permissionService.findAll();
  }

  @Get('permissions/:id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch('permissions/:id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
