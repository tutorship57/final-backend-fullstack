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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Authorized } from 'src/auth/guards/authorized.decorator';
import { PermissionGuard } from './guards/permission.guard';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Authorized('user', 'admin', 'company')
  @Get('users/:user_id/workspace/:workspace_id/permissions')
  async getUserPermissions(
    @Param('user_id') userId: string,
    @Param('workspace_id') workspaceId: string,
  ) {
    return this.permissionService.findUserPermissions(userId, workspaceId);
  }

  @Post()
  @Authorized('admin')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get('permissions/list')
  @Authorized('user', 'admin', 'company')
  findAll() {
    return this.permissionService.findAll();
  }

  @Get('permissions/:id')
  @Authorized('admin')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch('permissions/:id')
  @Authorized('admin')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Authorized('admin')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
