import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Authorized } from 'src/auth/guards/authorized.decorator';
import { WorkspaceRepository } from './workspace.repository';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users/:user_id/workspace')
@Authorized('user', 'admin', 'superAdmin')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

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
