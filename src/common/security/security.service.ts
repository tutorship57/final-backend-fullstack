import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
@Injectable()
export class SecurityService {
  private readonly argonOptions = {
    memoryCost: 65536,
    timeCost: 3,
  };
  async hashPassword(password: string) {
    return await argon2.hash(password, this.argonOptions);
  }
  async verifyPassword(password: string, hash: string) {
    return await argon2.verify(hash, password);
  }
}
