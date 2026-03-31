import { IsNotEmpty, IsUUID } from 'class-validator';
export class CreateWorkspaceMemberDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @IsUUID()
  workspace_id: string;
}
