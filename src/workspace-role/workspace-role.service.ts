import { Injectable } from '@nestjs/common';
import { CreateWorkspaceRoleDto } from './dto/create-workspace-role.dto';
import { UpdateWorkspaceRoleDto } from './dto/update-workspace-role.dto';

@Injectable()
export class WorkspaceRoleService {
  create(createWorkspaceRoleDto: CreateWorkspaceRoleDto) {
    return 'This action adds a new workspaceRole';
  }

  findAll() {
    return `This action returns all workspaceRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspaceRole`;
  }

  update(id: number, updateWorkspaceRoleDto: UpdateWorkspaceRoleDto) {
    return `This action updates a #${id} workspaceRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspaceRole`;
  }
}
