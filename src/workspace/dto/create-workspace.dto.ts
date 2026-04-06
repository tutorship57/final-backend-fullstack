import { IsNotEmpty, IsString } from 'class-validator';
import { SanitizeHtml } from 'src/common/decorators/sanitize-html.decorator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @SanitizeHtml()
  @IsString()
  name: string;

  @IsNotEmpty()
  @SanitizeHtml()
  @IsString()
  owner_id: string;
}
