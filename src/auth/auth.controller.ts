import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './types/Google.guard';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard) // You will need a guard that checks the cookie
  getProfile(@Req() req) {
    // The JwtAuthGuard will validate the token and attach the user to the request
    // Now you just return that user data to the frontend!
    return req.user;
  }

  @Get('oauth/google')
  @UseGuards(GoogleAuthGuard)
  async oauthLogin() {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token } = await this.authService.login(loginDto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
    });
    return res.sendStatus(200);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // We delegate the logic to the service
    return await this.authService.register(registerDto);
  }
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  oauthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const { access_token } = this.authService.loginByWithOAuth(user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      // secure: true,
      // sameSite: 'strict',
    });

    const redirectUrl = this.configService.get<string>('REDIRECT_URL');

    if (!redirectUrl) {
      throw new InternalServerErrorException(
        'Redirect URL not found in config',
      );
    }
    return res.redirect(redirectUrl);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      // Change 'accessToken' to 'access_token'
      httpOnly: true,
      secure: true, // Match your login settings
      sameSite: 'strict',
      path: '/',
    });

    return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }
}
