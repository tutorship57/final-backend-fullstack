import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { WorkspaceRepository } from './workspace.repository';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}
  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceRepo.create(createWorkspaceDto);
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
