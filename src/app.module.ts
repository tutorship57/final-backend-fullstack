import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { ProviderModule } from './provider/provider.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceRoleModule } from './workspace-role/workspace-role.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { PermissionModule } from './permission/permission.module';
import { BoardModule } from './board/board.module';
import { ListModule } from './list/list.module';
import { JwtModule } from '@nestjs/jwt';
import { TaskCardModule } from './task-card/task-card.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { RedisModule } from './common/storage/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisThrottlerStorage } from './common/storage/redis-throttler.storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    ThrottlerModule.forRootAsync({
      imports: [RedisModule], // ต้อง import module ที่มี storage อยู่
      inject: [RedisThrottlerStorage], // ฉีด storage เข้ามาใช้งาน
      useFactory: (storage: RedisThrottlerStorage) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60000,
            limit: 100,
          },
          {
            name: 'login_limit',
            ttl: 60000,
            limit: 5,
          },
        ],
        storage, // ส่งก้อน storage ที่ถูก inject แล้วให้ Throttler
      }),
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
    JwtModule.registerAsync({
      global: true,
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PassportModule.register({ session: true }),
    UserModule,
    ProviderModule,
    WorkspaceModule,
    WorkspaceMemberModule,
    WorkspaceRoleModule,
    PermissionModule,
    BoardModule,
    ListModule,
    TaskCardModule,
    ActivityLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
