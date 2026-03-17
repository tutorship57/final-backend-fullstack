import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/Google.guard';

@Controller('auth')
export class AuthController {
  constructor(authService: AuthService) {}
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
    // Handle the login success scenario.
    // You might want to create a session or generate a JWT token to send back to the client.
    // const redisCode = 'code';
  }
}
