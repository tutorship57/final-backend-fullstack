import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}
  create(createPermissionDto: CreatePermissionDto) {
    const newPermisson = this.permissionRepo.create(createPermissionDto);
    return this.permissionRepo.save(newPermisson);
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
