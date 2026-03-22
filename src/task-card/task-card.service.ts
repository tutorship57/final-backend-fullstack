import { Injectable } from '@nestjs/common';
import { CreateTaskCardDto } from './dto/create-task-card.dto';
import { UpdateTaskCardDto } from './dto/update-task-card.dto';

@Injectable()
export class TaskCardService {
  create(createTaskCardDto: CreateTaskCardDto) {
    return 'This action adds a new taskCard';
  }

  findAll() {
    return `This action returns all taskCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskCard`;
  }

  update(id: number, updateTaskCardDto: UpdateTaskCardDto) {
    return `This action updates a #${id} taskCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskCard`;
  }
}
