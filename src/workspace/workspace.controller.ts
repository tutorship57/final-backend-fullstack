import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Authorized } from 'src/auth/guards/authorized.decorator';
import { WorkspaceRepository } from './workspace.repository';

@Controller('users/:user_id/workspace')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}
  @Authorized('admin', 'company')
  @Post()
  async create(
    @Param('user_id') userId: string,
    @Req() req: any,
    @Body() dto: CreateWorkspaceDto,
  ) {
    // PROTECTION: Check if the URL ID matches the Token ID
    // if (userId !== req.user.sub) {
    //   throw new ForbiddenException(
    //     'You cannot create a workspace for another user!',
    //   );
    // }

    return this.workspaceService.create({
      ...dto,
      owner_id: userId,
    });
  }

  @Authorized('user', 'admin', 'company')
  @Get()
  findAll(@Param('user_id') userId: string) {
    return this.workspaceRepository.findUserWorkspaces(userId);
  }

  @Authorized('admin', 'company')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(id);
  }

  @Authorized('admin', 'company')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(id, updateWorkspaceDto);
  }
  @Authorized('admin', 'company')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(id);
  }
}
