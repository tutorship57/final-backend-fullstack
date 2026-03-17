import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { ProviderService } from 'src/provider/provider.service';
import { UserService } from 'src/user/user.service';
import { OauthLogin } from './types/loginOAuth.type';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly jwtService: JwtService,
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
    const newUser = await this.userService.create(user);

    const providerName = profile.provider;
    const sub_id = profile.id;

    await this.providerService.create({
      provider: providerName,
      sub_id: sub_id,
      user: newUser.id,
    });
    return { ...newUser, provider: providerName };
  }

  loginByWithOAuth(oAuthLoginData: OauthLogin) {
    const payload = { ...oAuthLoginData };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
