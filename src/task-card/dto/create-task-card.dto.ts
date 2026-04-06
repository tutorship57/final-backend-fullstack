import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { SanitizeHtml } from 'src/common/decorators/sanitize-html.decorator';
export class CreateTaskCardDto {
  @IsString()
  @IsNotEmpty()
  @SanitizeHtml()
  title: string;

  @IsUUID()
  @SanitizeHtml()
  list_id: string;
}
