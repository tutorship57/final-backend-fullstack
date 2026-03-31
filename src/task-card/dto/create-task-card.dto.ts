import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateTaskCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  list_id: string;
}
