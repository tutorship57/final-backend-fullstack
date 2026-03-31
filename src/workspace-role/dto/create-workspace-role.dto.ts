import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateWorkspaceRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  workspace_id: string;
}
