import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { SanitizeHtml } from 'src/common/decorators/sanitize-html.decorator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @SanitizeHtml() // <--- ดัก XSS ตรงนี้!
  title: string;

  @IsString()
  @IsOptional()
  @SanitizeHtml() // <--- ดัก XSS ตรงนี้!
  background_url: string;

  @IsUUID()
  @IsOptional()
  @SanitizeHtml() // <--- ดัก XSS ตรงนี้!
  workspace_id: string;
}
