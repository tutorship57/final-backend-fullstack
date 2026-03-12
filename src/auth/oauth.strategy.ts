import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('CLIENT_ID') || '',
      clientSecret: configService.get('CLIENT_SECRET') || '',

      callbackURL:
        configService.get('CALLBACK_URL') ||
        'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    try {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
    } catch (error) {
      console.log(error);
    }
  }
}
