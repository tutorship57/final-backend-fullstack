import { IsNotEmpty, IsString } from 'class-validator';
import { SanitizeHtml } from 'src/common/decorators/sanitize-html.decorator';
export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @SanitizeHtml() // <--- ดัก XSS ตรงนี้!
  name: string;
}
