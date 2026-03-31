import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // async canActivate(context: ExecutionContext) {
  //   const activate = (await super.canActivate(context)) as boolean;
  //   console.log('this is activate', activate);
  //   return activate;
  // }
}
