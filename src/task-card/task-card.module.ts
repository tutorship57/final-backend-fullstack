import { Module } from '@nestjs/common';
import { TaskCardService } from './task-card.service';
import { TaskCardController } from './task-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCard } from './entities/task-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskCard])],
  controllers: [TaskCardController],
  providers: [TaskCardService],
})
export class TaskCardModule {}
