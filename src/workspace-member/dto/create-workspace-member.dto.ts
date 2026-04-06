import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { SanitizeHtml } from 'src/common/decorators/sanitize-html.decorator';
export class CreateWorkspaceMemberDto {
  @IsUUID()
  @IsNotEmpty()
  @SanitizeHtml()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  @SanitizeHtml()
  workspace_id: string;

  @IsArray()
  @SanitizeHtml()
  @IsUUID('all', { each: true })
  role_ids: string[];
}
