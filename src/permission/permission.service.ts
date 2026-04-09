import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { Workspace } from 'src/workspace/entities/workspace.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(Workspace)
    private readonly workspaceRepo: Repository<Workspace>,
  ) {}
  create(createPermissionDto: CreatePermissionDto) {
    const newPermisson = this.permissionRepo.create(createPermissionDto);
    return this.permissionRepo.save(newPermisson);
  }

  async findUserPermissions(userId: string, workspaceId: string) {
    const workspace = await this.workspaceRepo.findOne({
      where: { id: workspaceId },
    });

    // Owner returns all permissions defined in the system
    if (workspace && workspace.owner_id === userId) {
      return this.permissionRepo.find();
    }

    // FIXED: Use manual joins for the many-to-many relationships
    return await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoin('permission.roles', 'role')
      .innerJoin('member_roles', 'mr', 'mr.role_id = role.id')
      .innerJoin('workspace_members', 'member', 'member.id = mr.member_id')
      .where('member.user_id = :userId', { userId })
      .andWhere('member.workspace_id = :workspaceId', { workspaceId })
      .getMany();
  }
  findAll() {
    return this.permissionRepo.find();
  }

  findOne(id: string) {
    return this.permissionRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const existedPermission = await this.findOne(id);
    if (!existedPermission) {
      throw new NotFoundException();
    }
    const updated = this.permissionRepo.merge(
      existedPermission,
      updatePermissionDto,
    );
    return this.permissionRepo.save(updated);
  }

  async remove(id: string) {
    const removed = await this.permissionRepo.delete(id);
    if (removed.affected === 0) {
      throw new NotFoundException();
    }
    return { id };
  }
}
