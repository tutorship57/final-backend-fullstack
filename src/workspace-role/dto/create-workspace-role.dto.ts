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
  workspace_id: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissions?: string[];
}
