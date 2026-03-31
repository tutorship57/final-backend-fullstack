import { Injectable } from '@nestjs/common';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { ActivityLog } from './entities/activity-log.entity';
import { Repository, Between, ILike } from 'typeorm'; // เพิ่ม ILike สำหรับการค้นหาข้อความ
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

  async findAll(query: {
    userId?: string;
    action?: string;
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { userId, action, page, limit, startDate, endDate } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = ILike(`%${action}%`);
    }

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    // ดึงข้อมูลพร้อมนับจำนวนทั้งหมด
    const [data, total] = await this.activityRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
    });

    return {
      message: 'ดึงข้อมูล Log สำเร็จ',
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string) {
    return await this.activityRepo.findOne({ where: { id: id as any } });
  }

  async remove(id: string) {
    await this.activityRepo.delete(id);
    return { message: `ลบ Log ID: ${id} เรียบร้อยแล้ว` };
  }
}
