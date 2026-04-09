import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['refresh_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')||
        'my_temporary_development_secret',
    });
  }

  async validate(req: Request, payload: any) {
    // payload คือข้อมูลที่ถอดรหัสออกมาจาก refresh_token (เช่น sub, email)
    if (!payload) {
      throw new UnauthorizedException();
    }

    // คืนค่าข้อมูล user (และอาจจะคืนตัว refreshToken เองถ้าต้องการตรวจสอบใน DB)
    return { ...payload, userId: payload.sub };
  }
}
