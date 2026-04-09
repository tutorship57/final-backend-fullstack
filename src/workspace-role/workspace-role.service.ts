import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceRoleDto } from './dto/create-workspace-role.dto';
import { UpdateWorkspaceRoleDto } from './dto/update-workspace-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceRole } from './entities/workspace-role.entity';
import { Repository } from 'typeorm';
import { Workspace } from 'src/workspace/entities/workspace.entity';

@Injectable()
export class WorkspaceRoleService {
  constructor(
    @InjectRepository(WorkspaceRole)
    private readonly roleRepo: Repository<WorkspaceRole>,
    // Inject the Workspace repo to check ownership!
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
  ) {}
  // workspace-role.service.ts

  async create(
    workspaceId: string,
    userId: string,
    createDto: CreateWorkspaceRoleDto,
  ) {
    // 1. SECURITY CHECK: Are they the owner?
    const workspace = await this.workspaceRepo.findOne({
      where: { id: workspaceId },
    });

    if (!workspace) throw new NotFoundException('Workspace not found');
    // if (workspace.owner_id !== userId) {
    //   throw new ForbiddenException(
    //     'Only the workspace owner can create roles.',
    //   );
    // }

    // 2. Map permission IDs to Entity objects if permissions are provided
    const permissionEntities =
      createDto.permissions?.map((id) => ({ id })) || [];

    const newRole = this.roleRepo.create({
      name: createDto.name,
      workspace_id: workspaceId,
      // Ensure your Entity has 'permissions' defined as Permission[]
      permissions: permissionEntities,
    });

    return this.roleRepo.save(newRole);
  }

  findAll(workspaceId: string) {
    return this.roleRepo.find({
      where: { workspace_id: workspaceId },
    });
  }
  findMemberRole(workspaceId: string, userId: string) {
    return this.roleRepo.find({
      where: { workspace_id: workspaceId },
    });
  }
  findOne(id: string) {
    return this.roleRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateWorkspaceRoleDto: UpdateWorkspaceRoleDto) {
    const existRole = await this.findOne(id);
    if (!existRole) {
      throw new NotFoundException();
    }
    const updated = this.roleRepo.merge(existRole, updateWorkspaceRoleDto);
    return this.roleRepo.save(updated);
  }

  async remove(id: string) {
    const removedUser = await this.roleRepo.delete(id);
    if (removedUser.affected === 0) {
      throw new NotFoundException();
    }
    return { id };
  }
}
