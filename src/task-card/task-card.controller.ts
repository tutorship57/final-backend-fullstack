import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskCardService } from './task-card.service';
import { CreateTaskCardDto } from './dto/create-task-card.dto';
import { UpdateTaskCardDto } from './dto/update-task-card.dto';

@Controller('task-card')
export class TaskCardController {
  constructor(private readonly taskCardService: TaskCardService) {}

  @Post()
  create(@Body() createTaskCardDto: CreateTaskCardDto) {
    return this.taskCardService.create(createTaskCardDto);
  }

  @Get()
  findAll() {
    return this.taskCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskCardService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskCardDto: UpdateTaskCardDto,
  ) {
    return this.taskCardService.update(id, updateTaskCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskCardService.remove(id);
  }
}
