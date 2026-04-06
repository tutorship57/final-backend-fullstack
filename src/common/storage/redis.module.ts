// src/common/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisThrottlerStorage } from './redis-throttler.storage';

@Module({
  imports: [ConfigModule], // นำเข้าเพื่อให้ Storage ใช้ ConfigService ได้
  providers: [RedisThrottlerStorage],
  exports: [RedisThrottlerStorage], // สำคัญ! ต้อง export เพื่อให้ ThrottlerModule มองเห็น
})
export class RedisModule {}
