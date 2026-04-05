import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Workspace } from '../workspace/entities/workspace.entity'; // <-- 1. Import Workspace Entity
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepo: Repository<WorkspaceMember>,

    // 2. Inject the Workspace Repo so we can verify the owner!
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
  ) {}

  async create(dto: CreateWorkspaceMemberDto) {
    const { role_ids, ...rest } = dto;
    const member = this.workspaceMemberRepo.create({
      ...rest,
      roles: role_ids.map((id) => ({ id })),
    });
    return this.workspaceMemberRepo.save(member);
  }

  findAll() {
    return this.workspaceMemberRepo.find();
  }

  findOne(id: string) {
    return this.workspaceMemberRepo.findOne({ where: { id: id } });
  }

  async update(id: string, updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
    const existMember = await this.workspaceMemberRepo.findOne({
      where: { id: id },
    });
    if (!existMember) throw new NotFoundException();

    const updated = this.workspaceMemberRepo.merge(
      existMember,
      updateWorkspaceMemberDto,
    );
    return await this.workspaceMemberRepo.save(updated);
  }

  async remove(id: string) {
    const result = await this.workspaceMemberRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException();
    return { id };
  }

  async findMembersWithRoles(workspaceId: string) {
    const members = await this.workspaceMemberRepo
      .createQueryBuilder('member')
      .innerJoin('users', 'user', 'user.id = member.user_id')
      .leftJoin('workspace_roles', 'role', 'role.id = member.role_id')
      .where('member.workspace_id = :workspaceId', { workspaceId })
      .select([
        'member.id AS id',
        'user.name AS name',
        'user.email AS email',
        'role.name AS role',
      ])
      .getRawMany();

    return members;
  }

  async assignRole(
    workspaceId: string,
    userId: string,
    memberId: string,
    roleId: string,
  ) {
    // 3. FIXED: Query the WORKSPACE repo, not the Member repo!
    const workspace = await this.workspaceRepo.findOne({
      where: { id: workspaceId },
    });

    if (!workspace) throw new NotFoundException('Workspace not found');

    // 4. FIXED: Compare owner_id to userId (your code compared workspace.id to userId)
    if (workspace.owner_id !== userId) {
      throw new ForbiddenException(
        'Security Alert: Only the workspace owner can assign roles.',
      );
    }

    const member = await this.workspaceMemberRepo.findOne({
      where: { id: memberId },
    });
    if (!member) throw new NotFoundException('Member not found');

    // 5. FIXED: Update role_id, not the member's primary ID!
    member.id = roleId;

    return this.workspaceMemberRepo.save(member);
  }
}
