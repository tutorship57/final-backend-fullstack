import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { OAuthStrategy } from './oauth.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, OAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
