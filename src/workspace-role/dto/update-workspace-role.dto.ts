import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceRoleDto } from './create-workspace-role.dto';

export class UpdateWorkspaceRoleDto extends PartialType(CreateWorkspaceRoleDto) {}
