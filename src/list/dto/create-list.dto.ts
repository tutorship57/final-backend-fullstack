import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';
import { SanitizeHtml } from 'src/common/decorators/sanitize-html.decorator';
export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  @SanitizeHtml() // <--- ดัก XSS ตรงนี้!
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @SanitizeHtml() // <--- ดัก XSS ตรงนี้!
  order: number;

  @IsNotEmpty()
  @IsUUID()
  @SanitizeHtml() // <--- ดัก XSS ตรงนี้!
  board_id: string;
}
