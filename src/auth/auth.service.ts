import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(email: string, password: string) {}

  async register(username: string, email: string, password: string) {}

  async validateOAuthLogin(profile:{}){}
}
