import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { ProviderModule } from './provider/provider.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_user',
      password: 'your_password',
      database: 'your_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    PassportModule.register({ session: true }),
    UserModule,
    ProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
