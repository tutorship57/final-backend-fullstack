import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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
import { User } from 'src/user/entities/user.entity';

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
      throw new ConflictException();
    }

    const passwordMatch = await this.securityService.verifyPassword(
      password,
      providerInfo.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 1. ADDED 'role' TO LOCAL LOGIN PAYLOAD
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const tokens = await this.getTokens(payload);
    const { refresh_token } = tokens;
    await this.providerService.updateRefresh(providerInfo.id, {
      refresh_token,
    });
    return tokens;
  }

  async validateOAuthLogin(profile: Profile) {
    const email = profile?.emails?.[0]?.value;
    const picture_url = profile?.photos?.[0].value;

    if (!email) {
      throw new UnauthorizedException('Email not found in profile');
    }

    if (!profile) {
      throw new UnauthorizedException();
    }

    const userExist: User | null = await this.userService.findByEmail(email);

    if (userExist) {
      return userExist; // This returns the full User entity, including role!
    }

    const user = {
      email: email,
      name: profile.displayName,
      picture_url: picture_url,
      // If you want to assign a default role to new OAuth users, do it in your UserService.create() or add it here
    };
    const newUser = await this.userService.create(user);

    const providerName = profile.provider;
    const sub_id = profile.id;

    const provider = await this.providerService.create({
      provider: providerName,
      sub_id: sub_id,
      user: newUser.id,
    });

    return { ...newUser, provider_id: provider.id, provider: providerName };
  }

  async getNewRefreshToken(payload: any,oldRefresh:string) {
    const tokens = await this.getTokens(payload);
    const { refresh_token } = tokens;
    const { userId } = payload;
    const provider = await this.providerService.findOne({
      userId: userId,
      refresh_token: oldRefresh,
    });
    if (!provider) {
      throw new UnauthorizedException('something went wrong please login');
    }
    await this.providerService.updateRefresh(provider?.id, {
      refresh_token: refresh_token,
    });

    return tokens;
  }

  async loginByWithOAuth(oAuthLoginData: OauthLogin) {
    // 2. ADDED 'role' TO OAUTH LOGIN PAYLOAD
    const payload = {
      email: oAuthLoginData.email,
      sub: oAuthLoginData.id,
      role: oAuthLoginData.role,
    };
    const tokens = await this.getTokens(payload);
    const { refresh_token } = tokens;
    const provider = await this.providerService.findOne({
      userId: oAuthLoginData.id,
    });
    if (!provider) {
      throw new NotFoundException('not found provider');
    }
    await this.providerService.updateRefresh(provider.id, {
      refresh_token,
    });
    return tokens;
  }

  async register(createUserDto: RegisterDto) {
    const { email, name, password } = createUserDto;

    // 1. Check for existing user (Account Enumeration protection is usually
    // for login; for registration, ConflictException is standard)
    const existEmail = await this.userService.findByEmail(email);
    if (existEmail) {
      throw new ConflictException('Email already registered');
    }

    const isPwned = await this.securityService.isPasswordPwned(password);
    // if pwd pwned login failed
    if (isPwned) {
      throw new BadRequestException(
        'This password has appeared in a data breach. Please choose a more secure password.',
      );
    }

    //Hash password (OWASP: Use strong hashing like Argon2/Bcrypt)
    const hashedPassword = await this.securityService.hashPassword(password);

    // Create User record
    const newUser = await this.userService.create({
      email,
      name,
    });

    // 4. Create local provider record linking to user
    const newProviderData = await this.providerService.create({
      password: hashedPassword,
      user: newUser.id,
      provider: 'local',
    });

    return {
      id: newUser.id,
      email: newUser.email,
      provider: newProviderData.provider,
    };
  }

  async getTokens(payload: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
