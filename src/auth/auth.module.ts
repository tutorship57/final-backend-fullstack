import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/GoogleStrategy.utils';
import { UserModule } from 'src/user/user.module';
import { ProviderModule } from 'src/provider/provider.module';
@Module({
  imports: [PassportModule, UserModule, ProviderModule],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
