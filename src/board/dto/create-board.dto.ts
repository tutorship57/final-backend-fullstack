import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  background_url: string;

  @IsUUID()
  @IsNotEmpty()
  workspace_id: string;
}
