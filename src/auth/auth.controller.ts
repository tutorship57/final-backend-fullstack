import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { OAuthStrategy } from './oauth.strategy';

@Controller('auth')
export class AuthController {
  constructor(authService: AuthService, oauthStrategy: OAuthStrategy) {}
  @Get('oauth/google')
  @UseGuards(AuthGuard('a'))
  async oauthLogin() {}

  @Post('/login')
  async login() {}

  @Post('register')
  async register() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('a'))
  oauthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    console.log(req);
    // const profile = oauthStrategy.
    // Handle the login success scenario.
    // You might want to create a session or generate a JWT token to send back to the client.
    // const redisCode = 'code';
    // return res.redirect(`http://localhost:3000?code=${redisCode}`);
  }
}
