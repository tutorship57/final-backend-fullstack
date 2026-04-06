import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceRepository } from './workspace.repository';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspaceMemberService } from 'src/workspace-member/workspace-member.service';
import { WorkspaceRoleService } from 'src/workspace-role/workspace-role.service';

@Injectable()
@UseGuards(JwtAuthGuard)
export class WorkspaceService {
  constructor(
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly workspaceMemberRepo: WorkspaceMemberService,
    @Inject(forwardRef(() => WorkspaceRoleService))
    private readonly workspaceRoleService: WorkspaceRoleService,
  ) {}

  async create(dto: CreateWorkspaceDto) {
    try {
      const workspace = await this.workspaceRepo.create(dto);

      //create Owner role
      // const ownerRole = await this.workspaceRoleService.create(
      //   workspace.id,
      //   dto.owner_id,
      //   {
      //     name: 'Owner',
      //     workspace_id: workspace.id,
      //     permissions: [], // Add default permission UUIDs here if you have them
      //   },
      // );

      // 3. Add the user as a member with the new Owner Role ID
      await this.workspaceMemberRepo.create({
        workspace_id: workspace.id,
        user_id: dto.owner_id,
        role_ids: [], // Now using the real ID from the step above
      });

      return workspace;
    } catch (error) {
      console.error('DETAILED ERROR:', error);
      throw new InternalServerErrorException(
        'Failed to initialize workspace components',
      );
    }
  }
  findAll() {
    return `This action returns all workspace`;
  }

  findOne(id: string) {
    return this.workspaceRepo.findById(id);
  }

  async update(id: string, dto: UpdateWorkspaceDto) {
    const workspace = await this.workspaceRepo.findById(id);

    if (!workspace) {
      throw new NotFoundException();
    }

    return await this.workspaceRepo.update(workspace, dto);
  }
  remove(id: string) {
    return this.workspaceRepo.remove(id);
  }
}
