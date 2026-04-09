import { PartialType } from '@nestjs/mapped-types';
import { CreateProviderDto } from './create-provider.dto';
import { IsString } from 'class-validator';
export class UpdateProviderDto extends PartialType(CreateProviderDto) {}

export class UpdateRefreshTokenDto {
  @IsString()
  refresh_token?: string;
}
