import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import type { ProviderType } from '../entities/provider.entity';
export class CreateProviderDto {
  @IsEnum(['local', 'google', 'github', 'facebook'])
  provider: ProviderType;

  @IsUUID()
  sub_id: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsUUID()
  user: string;
}
