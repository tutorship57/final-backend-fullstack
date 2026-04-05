import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
export class CreateWorkspaceRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  workspace_id: string; // The backend was rejecting your request because this was missing.

  @IsArray()
  @IsOptional()
  permissions?: string[];
}
