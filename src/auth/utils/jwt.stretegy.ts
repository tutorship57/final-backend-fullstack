import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.access_token;
          if (!token) return null;
          return token;
        },
      ]),
      ignoreExpiration: false,
      // Provide a fallback string
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        'my_temporary_development_secret',
    });
  }

  validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role, // <-- Tell passport to attach the role to req.user!
    };
  }
}
