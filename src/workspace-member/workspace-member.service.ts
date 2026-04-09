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
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private readonly workspaceMemberRepo: Repository<WorkspaceMember>,

    // 2. Inject the Workspace Repo so we can verify the owner!
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

  async inviteMember(
    workspaceId: string,
    inviterId: string,
    email: string,
    roleIds: string[],
  ) {
    // 1. Validation logic (workspace exists, user exists, etc.)
    const userToInvite = await this.userRepo.findOne({ where: { email } });
    if (!userToInvite) throw new NotFoundException('User not found');

    // 2. Filter roleIds to ensure only valid UUID strings are processed
    // This removes any "", null, or undefined values
    const validRoleIds = (roleIds || []).filter((id) => id && id.length > 0);

    // 3. Create the member
    const newMember = this.workspaceMemberRepo.create({
      workspace_id: workspaceId,
      user_id: userToInvite.id,
      // If validRoleIds is empty, roles will be an empty array []
      roles: validRoleIds.map((id) => ({ id }) as any),
    });

    return await this.workspaceMemberRepo.save(newMember);
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
    return await this.workspaceMemberRepo
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('member.workspace_id = :workspaceId', { workspaceId })
      .getMany();
  }

  async assignRole(
    workspaceId: string,
    userId: string,
    memberId: string,
    roleId: string,
  ) {
    const workspace = await this.workspaceRepo.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    // if (workspace.owner_id !== userId)
    //   throw new ForbiddenException('Only owner can assign roles');

    const member = await this.workspaceMemberRepo.findOne({
      where: { id: memberId },
      relations: ['roles'], // Load existing roles
    });

    if (!member) throw new NotFoundException('Member not found');

    // To replace the role:
    member.roles = [{ id: roleId } as any];

    return this.workspaceMemberRepo.save(member);
  }
}
