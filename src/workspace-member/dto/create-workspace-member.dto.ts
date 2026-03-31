import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
export class CreateWorkspaceMemberDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  workspace_id: string;

  @IsArray()
  @IsUUID('all', { each: true })
  role_ids: string[];
}
