import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query, // เพิ่มตัวนี้เข้ามา
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
// import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  // @Post()
  // create(@Body() createActivityLogDto: CreateActivityLogDto) {
  //   return this.activityLogService.create(createActivityLogDto);
  // }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.activityLogService.findAll({
      userId,
      action,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityLogService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityLogService.remove(id);
  }
}
