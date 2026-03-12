import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'a') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      authorizationURL: configService.get('AUTHORIZATION_URL') || '',
      tokenURL: configService.get('TOKEN_URL') || '',

      clientID: configService.get('CLIENT_ID') || '',
      clientSecret: configService.get('CLIENT_SECRET') || '',

      callbackURL:
        configService.get('CALLBACK_URL') ||
        'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile', 'openid'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    try {
      const user = await this.authService.validateOAuthLogin({});
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
