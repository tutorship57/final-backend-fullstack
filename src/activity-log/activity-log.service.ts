import { Injectable } from '@nestjs/common';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { ActivityLog } from './entities/activity-log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
  ) {}
  async create(createActivityLogDto: CreateActivityLogDto) {
    const activityLog = this.activityRepo.create(createActivityLogDto);
    return await this.activityRepo.save(activityLog);
  }

  findAll() {
    return this.activityRepo.find({});
  }

  findOne(id: string) {
    return `This action returns a #${id} activityLog`;
  }

  remove(id: string) {
    return `This action removes a #${id} activityLog`;
  }
}
