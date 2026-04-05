import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  background_url: string;

  @IsUUID()
  @IsOptional()
  workspace_id: string;
}
