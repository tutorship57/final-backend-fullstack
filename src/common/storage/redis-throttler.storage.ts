// src/common/storage/redis-throttler.storage.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
  ): Promise<ThrottlerStorageRecord> {
    // 1. เพิ่มตัวนับใน Redis
    const totalHits = await this.redis.incr(key);

    // 2. ถ้าเป็นครั้งแรก ให้ตั้งเวลาหมดอายุ (วินาที)
    if (totalHits === 1) {
      await this.redis.expire(key, Math.ceil(ttl / 1000));
    }

    // 3. ดึงเวลาที่เหลือจาก Redis (วินาที)
    const secondsLeft = await this.redis.ttl(key);
    const timeToExpire = Math.max(0, secondsLeft);

    const isBlocked = totalHits > limit;

    const timeToBlockExpire = timeToExpire;

    return {
      totalHits,
      timeToExpire,
      isBlocked,
      timeToBlockExpire,
    };
  }
}