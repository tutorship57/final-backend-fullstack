import { Module } from '@nestjs/common';
import { TaskCardService } from './task-card.service';
import { TaskCardController } from './task-card.controller';

@Module({
  controllers: [TaskCardController],
  providers: [TaskCardService],
})
export class TaskCardModule {}
