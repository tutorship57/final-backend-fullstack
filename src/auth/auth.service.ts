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

  async validateOAuthLogin(profile: Profile) {
    const email = profile?.emails?.[0]?.value;
    const picture_url = profile?.photos?.[0].value;
    if (!email) {
      throw new UnauthorizedException('Email not found in profile');
    }
    console.log('this is the validated call ,', profile);
    if (!profile) {
      throw new UnauthorizedException();
    }

    const userExist = await this.userService.findByEmail(email);
    console.log(userExist);
    if (userExist) {
      return userExist;
    }

    const user = {
      email: email,
      name: profile.displayName,
      picture_url: picture_url,
    };

    return await this.userService.create(user);
  }
}
