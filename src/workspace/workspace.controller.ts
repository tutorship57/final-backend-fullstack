import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Authorized } from 'src/auth/guards/authorized.decorator';
import { WorkspaceRepository } from './workspace.repository';

@Controller('users/:user_id/workspace')
@Authorized('user', 'admin', 'superAdmin')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  @Post()
  create(
    @Param('user_id') userId: string,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspaceService.create({
      ...createWorkspaceDto,
      owner_id: userId,
    });
  }

  @Get()
  findAll(@Param('user_id') userId: string) {
    return this.workspaceRepository.findUserWorkspaces(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(id);
  }
}
