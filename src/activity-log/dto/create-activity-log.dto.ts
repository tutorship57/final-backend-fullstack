import { IsInt, IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class CreateActivityLogDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsUUID()
  workspace_id?: string;

  @IsString()
  action: string;

  @IsString()
  method: string;

  @IsString()
  route: string;

  @IsInt()
  status_code: number;

  @IsOptional()
  @IsString()
  target_type?: string;

  @IsOptional()
  @IsUUID()
  target_id?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
