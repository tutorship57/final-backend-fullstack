import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';
export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsUUID()
  board_id: string;
}
