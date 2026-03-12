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
      host: process.env.HOST_DB || 'postgres',
      port: 5432,
      username: process.env.USERNAME_DB || 'postgres',
      password: process.env.PASSWORD_DB || 'your_password',
      database: process.env.DB_NAME || 'your_db',
      autoLoadEntities: process.env.MODE !== 'prod' ? true : false,
      synchronize: process.env.MODE !== 'prod' ? true : false,
      logging:
        process.env.MODE === 'prod' ? ['error', 'warn'] : ['query', 'error'],
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
