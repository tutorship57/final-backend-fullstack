import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceRoleDto } from './dto/create-workspace-role.dto';
import { UpdateWorkspaceRoleDto } from './dto/update-workspace-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceRole } from './entities/workspace-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceRoleService {
  constructor(
    @InjectRepository(WorkspaceRole)
    private readonly workspaceRoleRepo: Repository<WorkspaceRole>,
  ) {}
  async create(createWorkspaceRoleDto: CreateWorkspaceRoleDto) {
    const { name, workspace_id, permissions } = createWorkspaceRoleDto;

    const newWorkspaceRole = this.workspaceRoleRepo.create({
      name,
      workspace_id,
      permissions: permissions?.map((id) => ({ id })),
    });
    return await this.workspaceRoleRepo.save(newWorkspaceRole);
  }

  findAll() {
    return this.workspaceRoleRepo.find();
  }

  findOne(id: string) {
    return this.workspaceRoleRepo.findOne({
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
    const updated = this.workspaceRoleRepo.merge(
      existRole,
      updateWorkspaceRoleDto,
    );
    return this.workspaceRoleRepo.save(updated);
  }

  async remove(id: string) {
    const removedUser = await this.workspaceRoleRepo.delete(id);
    if (removedUser.affected === 0) {
      throw new NotFoundException();
    }
    return { id };
  }
}
