import { Injectable } from '@nestjs/common';
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

  async validateOAuthLogin(profile:Profile) {
    console.log("this is the validated call ")
  }
}
