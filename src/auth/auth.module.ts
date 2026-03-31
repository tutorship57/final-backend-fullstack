import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/GoogleStrategy.utils';
import { UserModule } from 'src/user/user.module';
import { ProviderModule } from 'src/provider/provider.module';
import { SecurityModule } from 'src/common/security/security.module';
import { JwtStrategy } from './utils/jwt.stretegy';
@Module({
  imports: [PassportModule, UserModule, ProviderModule, SecurityModule],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
