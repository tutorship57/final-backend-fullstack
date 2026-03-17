import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/Google.guard';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('oauth/google')
  @UseGuards(GoogleAuthGuard)
  async oauthLogin() {}

  @Post('/login')
  async login() {}

  @Post('register')
  async register() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  oauthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const { access_token } = this.authService.loginByWithOAuth(user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
    });

    const redirectUrl = this.configService.get<string>('REDIRECT_URL');

    if (!redirectUrl) {
      throw new InternalServerErrorException(
        'Redirect URL not found in config',
      );
    }
    return res.redirect(redirectUrl);
  }
}
