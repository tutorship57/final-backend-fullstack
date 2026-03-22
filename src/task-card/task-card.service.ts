import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskCardDto } from './dto/create-task-card.dto';
import { UpdateTaskCardDto } from './dto/update-task-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskCard } from './entities/task-card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskCardService {
  constructor(
    @InjectRepository(TaskCard)
    private readonly taskCardRepo: Repository<TaskCard>,
  ) {}
  create(createTaskCardDto: CreateTaskCardDto) {
    const newTaskCard = this.taskCardRepo.create(createTaskCardDto);
    return this.taskCardRepo.save(newTaskCard);
  }

  findAll() {
    return this.taskCardRepo.find();
  }

  findOne(id: string) {
    return this.taskCardRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateTaskCardDto: UpdateTaskCardDto) {
    const existTaskCard = await this.findOne(id);
    if (!existTaskCard) {
      throw new NotFoundException();
    }
    const updated = this.taskCardRepo.merge(existTaskCard, updateTaskCardDto);
    return this.taskCardRepo.save(updated);
  }
  async remove(id: string) {
    const removed = await this.taskCardRepo.delete(id);
    if (removed.affected === 0) {
      throw new NotFoundException();
    }
    return { id };
  }
}
