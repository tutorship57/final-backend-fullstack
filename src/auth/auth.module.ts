import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { OAuthStrategy } from './oauth.strategy';
import { GoogleStrategy } from './utils/GoogleStrategy.utils';
import { UserModule } from 'src/user/user.module';
import { ProviderModule } from 'src/provider/provider.module';
@Module({
  imports: [PassportModule, UserModule, ProviderModule],
  providers: [AuthService, OAuthStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
