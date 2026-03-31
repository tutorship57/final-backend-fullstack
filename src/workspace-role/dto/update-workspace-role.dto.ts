import { IsOptional, IsString, IsUUID } from 'class-validator';
export class UpdateWorkspaceRoleDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsUUID()
  @IsOptional()
  workspace_id: string;
}
