import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('CLIENT_ID') || '',
      clientSecret: configService.get('CLIENT_SECRET') || '',
      callbackURL: configService.get('CALLBACK_URL') || '',
      scope: ['profile', 'email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // done: VerifiedCallback,
  ) {
    /// provide code
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const user = this.authService.validateOAuthLogin(profile);
    console.log('end validate');
    return user;
  }
}
