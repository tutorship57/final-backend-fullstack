import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
@Injectable()
export class WorkspaceRepository {
  constructor(
    @InjectRepository(Workspace)
    private readonly repo: Repository<Workspace>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const newWorkspace = this.repo.create(createWorkspaceDto);
    return await this.repo.save(newWorkspace);
  }

  async findById(id: string): Promise<Workspace | null> {
    return await this.repo.findOne({ where: { id: id } });
  }

  async update(
    workspace: Workspace,
    dto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const updated = this.repo.merge(workspace, dto);
    return await this.repo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }
  }

  async findUserWorkspaces(userId: string) {
    return await this.repo
      .createQueryBuilder('workspace')
      // 1. Join the workspace_members table
      // 'member' is just an alias we give it for this query
      .leftJoin(
        'workspace_members',
        'member',
        'member.workspace_id = workspace.id',
      )
      // 2. Check if they are the owner...
      .where('workspace.owner_id = :userId', { userId })
      // 3. OR check if they are in the members table
      .orWhere('member.user_id = :userId', { userId })
      .getMany();
  }
}
