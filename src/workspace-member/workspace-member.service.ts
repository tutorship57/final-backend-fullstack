import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepo: Repository<WorkspaceMember>,
  ) {}
  create(createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
    const newMember = this.workspaceMemberRepo.create(createWorkspaceMemberDto);
    return this.workspaceMemberRepo.save(newMember);
  }

  findAll() {
    return this.workspaceMemberRepo.find();
  }

  findOne(id: string) {
    return this.workspaceMemberRepo.findOne({ where: { id: id } });
  }

  async update(id: string, updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
    const existMember = await this.workspaceMemberRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!existMember) {
      throw new NotFoundException();
    }
    const updated = this.workspaceMemberRepo.merge(
      existMember,
      updateWorkspaceMemberDto,
    );
    return await this.workspaceMemberRepo.save(updated);
  }

  async remove(id: string) {
    const result = await this.workspaceMemberRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return { id };
  }
}
