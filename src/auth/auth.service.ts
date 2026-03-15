import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { ProviderService } from 'src/provider/provider.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
  ) {}
  async login(email: string, password: string) {}

  async register(username: string, email: string, password: string) {}

  validateOAuthLogin(profile: Profile) {
    console.log('this is the validated call ,', profile);
    if (!profile) {
      throw new UnauthorizedException();
    }
    if (profile?.emails[0]?.value === undefined) {
      throw new UnauthorizedException();
    }

    const userExist = this.userService.findByEmail(profile.emails[0].value);

    if (userExist) {
      return userExist;
    }
    const user = {
      email: profile?.emails[0]?.value,
      name: profile.displayName,
      picture_url: profile?.photos[0]?.value || null,
    };

    const createUser = this.userService.create(user);
  }
}
