import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { ProviderService } from 'src/provider/provider.service';
import { UserService } from 'src/user/user.service';
import { OauthLogin } from './types/loginOAuth.type';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from 'src/common/security/security.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
  ) {}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const providerInfo = await this.providerService.findOne({
      userId: user.id,
    });
    if (!providerInfo || providerInfo.provider != 'local') {
      throw new BadRequestException();
    }

    const passwordMatch = await this.securityService.verifyPassword(
      password,
      providerInfo.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token: access_token };
  }

  async register(createUserDto: RegisterDto) {
    const { email, name } = createUserDto;
    const existEmail = await this.userService.findByEmail(email);

    if (existEmail) {
      throw new ConflictException();
    }

    const hashedPassword = await this.securityService.hashPassword(
      createUserDto.password,
    );

    const newUser = await this.userService.create({
      email,
      name,
    });

    const newProviderData = await this.providerService.create({
      password: hashedPassword,
      user: newUser.id,
      provider: 'local',
    });

    return {
      id: newUser.id,
      email: newUser.email,
      provider: newProviderData.provider,
      provider_id: newProviderData.id,
    };
  }

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
